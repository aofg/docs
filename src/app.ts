import { ContentState } from "./state";
import { join } from "path";
import { IncomingMessage, ServerResponse } from "http";
import micro, { send } from "micro";
import route from "micro-route";

// import os from "os";
// import uuid from "uuid/v4";
// import { resolve, join } from "path";
// import glob from "glob";
// import { promisify } from "util";
// import rimraf = require("rimraf");
// import { readFileSync } from "fs";
// import yaml from "js-yaml";

// const fm = require("front-matter") as (
//   content: string
// ) => {
//   attributes: any;
//   body: string;
//   frontmatter: string;
// };

// const OWNER = "aofg";
// const REPO = "docs";
// const BRANCH = "master";
// const GITHUB_PATH = `${OWNER}/${REPO}`;
// const REPO_FOLDER = `${REPO}-${BRANCH}`;
// const LOCALES = ["en", "ru"];

// const asyncRimraf = promisify(rimraf);
// const asyncGlob = promisify(glob);

// export interface ITreeLeaf {
//   path: string[];
//   title: string;
//   description: string;
//   breadcrumbs: string;
//   content: string;
// }

// export interface ITreeBranch {
//   path: string[];
//   children?: { [directory: string]: ITreeBranch };
//   content?: ITreeLeaf[];
// }

// export interface ITreeContentBranch extends ITreeBranch {
//   title?: string;
//   description?: string;
//   breadcrumbs?: string;
// }

// export interface ITreeRoot extends ITreeBranch {
//   locale: string;
// }

// async function loadContent() {
//   const clonePath = resolve(os.tmpdir(), uuid());
//     await download(
//       `https://github.com/${GITHUB_PATH}/archive/${BRANCH}.zip`,
//       clonePath,
//       { extract: true }
//     );
//   return resolve(clonePath, REPO_FOLDER);
// }

// async function getStructure(rootPath: string) {
//   return asyncGlob("**/*.*", {
//     cwd: rootPath,
//     nodir: false
//   });
// }

// function ensureStructure(root: ITreeBranch, path: string[]): ITreeBranch {
//   if (path.length > 0) {
//     if (typeof root.children !== "object") {
//       root.children = {};
//     }

//     if (typeof root.children[path[0]] === "undefined") {
//       root.children[path[0]] = {
//         path: [...root.path, path[0]]
//       };
//     }

//     const next = root.children[path[0]];

//     return ensureStructure(next, path.slice(1));
//   } else {
//     return root;
//   }
// }

// async function parseContent(contentPath: string) {
//   const contentTree = LOCALES.reduce(
//     (tree, locale) => ((tree[locale] = { locale, path: [locale] }), tree),
//     {} as { [locale: string]: ITreeRoot }
//   );

//   const localeRoots = LOCALES.map(locale => join(contentPath, locale));
//   const localeStructures = await Promise.all(
//     localeRoots.map(path => getStructure(path))
//   );
//   const localeSections = localeStructures.map(structure =>
//     structure.filter(path => /\_section.yml$/i.test(path))
//   );

//   console.log(localeSections, localeStructures)
//   const localeContent = localeStructures.map(structure =>
//     structure.filter(path => /.md$/i.test(path))
//   );

//   localeSections.forEach((structure, localeIndex) =>
//     structure.forEach(path => {
//       const dirpath = path.slice(0, -"_section.yml".length);
//       const dirparts = dirpath.split("/").filter(p => p.length > 0);
//       const locale = LOCALES[localeIndex];

//       const branch = ensureStructure(
//         contentTree[locale],
//         dirparts
//       ) as ITreeContentBranch;

//       const definition = yaml.safeLoad(
//         readFileSync(join(contentPath, locale, path), "utf8")
//       ) as {
//         title: string;
//         breadcrumbs?: string;
//         description?: string;
//       };

//       branch.title = definition.title;
//       branch.description = definition.description;
//       branch.breadcrumbs = definition.breadcrumbs;
//     })
//   );

//   localeContent.forEach((structure, localeIndex) =>
//     structure.forEach(path => {
//       const locale = LOCALES[localeIndex];
//       const parts = path.split("/");
//       const name = parts[parts.length - 1].slice(0, -".md".length);
//       const dirparts = parts.slice(0, -1);

//       const branch = ensureStructure(
//         contentTree[locale],
//         dirparts
//       ) as ITreeContentBranch;

//       const content = readFileSync(join(contentPath, locale, path), "utf8");
//       const definition = fm(content);

//       branch.content = branch.content || [];

//       branch.content.push({
//         path: [locale, ...dirparts, name],
//         title: definition.attributes.title,
//         breadcrumbs: definition.attributes.breadcrumbs,
//         description: definition.attributes.description,
//         content: definition.body
//       });
//     })
//   );

//   return contentTree;
// }

// async function updateState() {
//   console.log("load actual state");

//   const temporaryState = await loadContent();

//   try {
//     const contentTree = await parseContent(temporaryState);
//     console.log(JSON.stringify(contentTree, null, 2));
//   } catch (e) {
//     console.log("eror", e);
//   }

//   console.log("remote temporary folder at " + temporaryState);
//   await asyncRimraf(temporaryState);
// }

// async function localState() {
//   try {
//     const contentTree = await parseContent(join(__dirname, '..'));
//     console.log(JSON.stringify(contentTree, null, 2));
//   } catch (e) {
//     console.log("eror", e);
//   }
// }

// const server = micro(function(req: IncomingMessage, res: ServerResponse) {
//   if (req.method === "POST" && req.url === "/hook") {
//     // on github hook call
//   }

//   // cors policies
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//   const { url } = req;

//   console.log(url);

//   if (typeof url === "undefined") {
//     return send(res, 400, { error: true, message: "url is required" });
//   }

//   if (route(/^\/menu\/?$/i, "GET")(req)) {
//     return send(res, 200, {
//       test: "foo"
//     });
//   }

//   return send(res, 400, { error: true, message: "unknown request" });

//   //   get(/^\/menu$/i, function() {

//   //   })
// });

// // console.log('load content')
// // loadContent().then(root => getStructure(root)).then(() => root)).then(root => asyncRimraf(root));
// // updateState();
// localState();
// server.listen(4000);

async function run() {
  const state = new ContentState(
    ["ru", "en"],
    join(__dirname, "..", "tmp", "persist")
  ); //uuid()));
  await state.loadLocal(join(__dirname, ".."));

  const server = micro((req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "POST" && req.url === "/hook") {
      // commit hook!
      // TODO: loadGithub state
    }

    // cors policies
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const { url } = req;

    if (typeof url === "undefined") {
      return send(res, 400, { error: true, message: "url is required" });
    }

    if (route(/^\/tree\/?$/i, "GET")(req)) {
      return send(res, 200, state.tree);
    }
    if (route(/^\/menu\/?$/i, "GET")(req)) {
      return send(res, 200, state.menu);
    }

    if (route(/^\/content\//i, "GET")(req)) {
      const params = url.slice("/content".length);
      const matches = params.match(/(\/[^\/]+)/gim);
      if (matches) {
        return send(
          res,
          200,
          state.getContent(matches.map(part => part.slice(1)))
        );
      }
      return send(res, 404, { error: true, message: "not found" });
    }

    return send(res, 404, { error: true, message: "not found" });
  });

  server.listen(4567);
}

run();
