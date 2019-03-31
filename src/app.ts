import micro, { send } from "micro";
import { IncomingMessage, ServerResponse } from "http";
import route from "micro-route";
import os from "os";
import uuid from "uuid/v4";
import { resolve, join } from "path";
import download = require("download");
import glob from "glob";
import { promisify } from "util";
import rimraf = require("rimraf");
import { readFileSync } from "fs";
import yaml from "js-yaml";

const OWNER = "aofg";
const REPO = "docs";
const BRANCH = "master";
const GITHUB_PATH = `${OWNER}/${REPO}`;
const REPO_FOLDER = `${REPO}-${BRANCH}`;
const LOCALES = ["en", "ru"];

const asyncRimraf = promisify(rimraf);
const asyncGlob = promisify(glob);

export interface ITreeLeaf {
  title: string;
  description: string;
  breadcrumbs: string;
  content: string;
}

export interface ITreeBranch {
  path: string[];
  children?: { [directory: string]: ITreeBranch };
  content?: ITreeLeaf[];
}

export interface ITreeContentBranch extends ITreeBranch {
  title?: string;
  description?: string;
  breadcrumb?: string;
}

export interface ITreeRoot extends ITreeBranch {
  locale: string;
}

async function loadContent() {
  const clonePath = resolve(os.tmpdir(), uuid());
  await download(
    `https://github.com/${GITHUB_PATH}/archive/${BRANCH}.zip`,
    clonePath,
    { extract: true }
  );
  return resolve(clonePath, REPO_FOLDER);
}

async function getStructure(rootPath: string) {
  return asyncGlob("**/*.*", {
    cwd: rootPath,
    nodir: false
  });
}

function ensureStructure(root: ITreeBranch, path: string[]): ITreeBranch {
  if (typeof root.children !== "object") {
    root.children = {};
  }

  if (typeof root.children[path[0]] === "undefined") {
    root.children[path[0]] = {
      path: [...root.path, path[0]]
    };
  }

  const next = root.children[path[0]];
  path.shift();

  if (path.length > 0) {
    return ensureStructure(next, path);
  } else {
    return next;
  }
}

async function updateState() {
  console.log("load actual state");
  const contentTree = LOCALES.reduce(
    (tree, locale) => ((tree[locale] = { locale, path: [ locale ] }), tree),
    {} as { [locale: string]: ITreeRoot }
  );

  const temporaryState = await loadContent();
  try {
    const localeRoots = LOCALES.map(locale => join(temporaryState, locale));
    const localeStructures = await Promise.all(
      localeRoots.map(path => getStructure(path))
    );
    const localeSections = localeStructures.map(structure =>
      structure.filter(path => /\/_section.yml$/i.test(path))
    );

    localeSections.forEach((structure, localeIndex) =>
      structure.forEach(path => {
        const dirpath = path.slice(0, -"/_section.yml".length);
        const dirparts = dirpath.split("/");
        const locale = LOCALES[localeIndex];

        const branch = ensureStructure(
          contentTree[locale],
          dirparts
        ) as ITreeContentBranch;

        const definition = yaml.safeLoad(
          readFileSync(join(temporaryState, locale, path), "utf8")
        ) as {
          title: string;
          breadcrumbs?: string;
          description?: string;
        };

        branch.title = definition.title;
        branch.description = definition.description;
        branch.breadcrumb = definition.breadcrumbs;
      })
    );

    console.log(localeStructures);
    console.log(localeSections);
    console.log(JSON.stringify(contentTree, null, 2));

} catch (e) {
    console.error(e);
}
console.log("remote temporary folder at " + temporaryState);
await asyncRimraf(temporaryState);
}

const server = micro(function(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "POST" && req.url === "/hook") {
    // on github hook call
  }

  // cors policies
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { url } = req;

  console.log(url);

  if (typeof url === "undefined") {
    return send(res, 400, { error: true, message: "url is required" });
  }

  if (route(/^\/menu\/?$/i, "GET")(req)) {
    return send(res, 200, {
      test: "foo"
    });
  }

  return send(res, 400, { error: true, message: "unknown request" });

  //   get(/^\/menu$/i, function() {

  //   })
});

// console.log('load content')
// loadContent().then(root => getStructure(root)).then(() => root)).then(root => asyncRimraf(root));
updateState();
server.listen(4000);
