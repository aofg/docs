import os from "os";
import { exists, existsSync, copy, pathExists, readFile } from "fs-extra";
import { promisify } from "util";
import { resolve, join } from "path";
import uuid from "uuid/v4";
import download = require("download");
import rimraf = require("rimraf");
import { ITreeRoot, ITreeBranch, ITreeContentBranch, ITreeLeaf } from "./models";
import glob = require("glob");
import yaml from "js-yaml";

// TODO: make decalaration types
const fm = require("front-matter") as (
  content: string
) => {
  attributes: any;
  body: string;
  frontmatter: string;
};

const asyncGlob = promisify(glob);
const rimrafAsync = promisify(rimraf);

// async function githubState() : ContentState {
//     const clonePath = resolve(os.tmpdir(), uuid());
//     await download(
//         `https://github.com/${GITHUB_PATH}/archive/${BRANCH}.zip`,
//         clonePath,
//         { extract: true }
//       );
// }

function recursiveFlatMenu(node : ITreeContentBranch) {
  var menuNode = {} as any;

  if (node.content) {
    menuNode.title = node.title;
    menuNode.description = node.description;
    menuNode.breadcrumbs = node.breadcrumbs || node.title;

    menuNode.pages = Object.values(node.content).reduce(( dict, page) => (dict[page.path[page.path.length - 1]] = {
      title: page.title,
      breadcrumbs: page.breadcrumbs,
      description: page.description,
      path: page.path.join('/')
    }, dict), {} as any)
  }

  
  if (node.children) {
    menuNode.children = {}
    const keys = Object.keys(node.children)
    for (const key of keys) {
      menuNode.children[key] = recursiveFlatMenu(node.children[key])
    }
  }

  return menuNode;
}

function recursiveTraverse(node : ITreeBranch, path: string[]) : ITreeBranch {
  console.log(path)
  if (path.length === 0) {
    return node;
  }

  if (!node.children) {
    throw new Error("not found")
  }

  return recursiveTraverse(node.children[path[0]], path.slice(1));
}

async function parseState() {
  throw new Error("not implemented yet");
}

export class ContentState {
  public path: string;
  public locales: string[];
  public tree: {
    [locale: string]: ITreeRoot;
  };
  public menu: {
    [locale: string]: any;
  };
  public ready: boolean;


  constructor(locales?: string[], path?: string) {
    if (typeof locales === "undefined") {
      locales = ["ru", "en"];
    }

    if (typeof path !== "undefined") {
      this.path = path;
    } else {
      this.path = resolve(os.tmpdir(), uuid());
    }

    this.tree = locales.reduce(
      (dict, locale) => ((dict[locale] = { locale, path: [locale] }), dict),
      {} as {
        [locale: string]: ITreeRoot;
      }
    );

    this.menu = locales.reduce(
      (dict, locale) => ((dict[locale] = null), dict),
      {} as {
        [locale: string]: any;
      }
    );

    this.locales = locales;

    this.ready = false;
  }

  

  getContent(path: string[]): ITreeLeaf | null {
    const lang = path[0];
    const page = path[path.length - 1];
    const nodePath = path.slice(1, -1);
    try {
      const node = recursiveTraverse(this.tree[lang], nodePath);
      console.log(page)
      console.log(node.content![page])
      return node.content![page];
    } catch {
      return null;
    }

  }

  async parseState() {
    if (!(await pathExists(this.path))) {
      throw new Error(`path doesnt exit (${this.path})`);
    }

    await Promise.all(this.locales.map(l => this.parseLocaleState(l)));

    this.locales.forEach(locale => this.menu[locale] = recursiveFlatMenu(this.tree[locale]))
  }

  async parseLocaleState(locale: string) {
    if (typeof this.tree[locale] === "undefined") {
      throw new Error(`locale (${locale}) is unknown`);
    }

    const localeRoot = join(this.path, locale);

    if (!(await pathExists(localeRoot))) {
      throw new Error(
        `locale (${locale}) doesnt exit in state path (${this.path})`
      );
    }

    const structure = await asyncGlob("**/*.*", {
      cwd: localeRoot,
      nodir: false
    });

    const sections = structure.filter(path => /\_section.yml$/i.test(path));
    const content = structure.filter(path => /.md$/i.test(path));

    await Promise.all(
      sections.map(async path => {
        const dirpath = path.slice(0, -"_section.yml".length);
        const dirparts = dirpath.split("/").filter(p => p.length > 0);
        const branch = this.ensureStructure(
          this.tree[locale],
          dirparts
        ) as ITreeContentBranch;

        const sectionDefinitionFile = await readFile(
          join(localeRoot, path),
          "utf8"
        );
        const definition = yaml.safeLoad(sectionDefinitionFile) as {
          title: string;
          breadcrumbs?: string;
          description?: string;
        };

        branch.title = definition.title;
        branch.description = definition.description;
        branch.breadcrumbs = definition.breadcrumbs;
      })
    );

    await Promise.all(
      content.map(async path => {
        const parts = path.split("/").filter(p => p.length > 0);
        const name = parts[parts.length - 1]//.slice(0, -".md".length);
        const dirparts = parts.slice(0, -1);

        const branch = this.ensureStructure(
          this.tree[locale],
          dirparts
        ) as ITreeContentBranch;

        const contentFile = await readFile(join(localeRoot, path), "utf8");
        const definition = fm(contentFile);

        branch.content = branch.content || {};

        branch.content[name] = {
          path: [...dirparts, name],
          title: definition.attributes.title,
          breadcrumbs: definition.attributes.breadcrumbs,
          description: definition.attributes.description,
          content: definition.body
        };
      })
    );
  }

  private ensureStructure(root: ITreeBranch, path: string[]): ITreeBranch {
    if (path.length > 0) {
      if (typeof root.children !== "object") {
        root.children = {};
      }

      if (typeof root.children[path[0]] === "undefined") {
        root.children[path[0]] = {
          path: [...root.path, path[0]]
        };
      }

      const next = root.children[path[0]];

      return this.ensureStructure(next, path.slice(1));
    } else {
      return root;
    }
  }

  async clearState() {
    if (pathExists(this.path)) {
      await rimrafAsync(this.path);
    }
  }

  async loadLocal(root: string) {
    await this.clearState();
    await Promise.all(
      this.locales.map(
        locale => (
          console.log(
            "copy from " + join(root, locale) + " to " + join(this.path, locale)
          ),
          copy(join(root, locale), join(this.path, locale), {
            recursive: true
          })
        )
      )
    );

    return this.parseState();
  }

  async loadGithub(owner: string, repository: string, branch: string) {
    await this.clearState();
    await download(
      `https://github.com/${owner}/${repository}/archive/${branch}.zip`,
      this.path,
      {
        extract: true
      }
    );

    return this.parseState();
  }
  async dispose() {
    this.clearState();
  }
}
