const fs = require("fs");
const genLangConfs = require("./genlangconfs");
const genSyntaxFile = require("./gensyntax");

const { configs } = require("@coderosh/myriad");
const path = require("path");

for (const type of Object.keys(configs)) {
  const lang = genLangConfs(type);
  const syntax = genSyntaxFile(type);

  fs.writeFileSync(path.join("syntaxes", `${type}.tmLanguage.json`), syntax);
  fs.writeFileSync(path.join("langconfs", `${type}.json`), lang);
}
