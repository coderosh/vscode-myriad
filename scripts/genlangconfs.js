const { configs } = require("@coderosh/myriad");

/**
 * @param {keyof configs} type
 */
module.exports = function genLangConfs(type) {
  const config = configs[type];
  const brackets = config.bracketConfig;

  return JSON.stringify(
    {
      comments: {
        lineComment: "//",
        blockComment: ["/*", "*/"],
      },
      brackets: [
        [brackets.curlyOpen, brackets.curlyClose],
        [brackets.sqrOpen, brackets.sqrClose],
        [brackets.parenOpen, brackets.parenClose],
      ],
      autoClosingPairs: [
        [brackets.curlyOpen, brackets.curlyClose],
        [brackets.sqrOpen, brackets.sqrClose],
        [brackets.parenOpen, brackets.parenClose],
        ['"', '"'],
        ["'", "'"],
        ["`", "`"],
      ],
      surroundingPairs: [
        [brackets.curlyOpen, brackets.curlyClose],
        [brackets.sqrOpen, brackets.sqrClose],
        [brackets.parenOpen, brackets.parenClose],
        ['"', '"'],
        ["'", "'"],
        ["`", "`"],
      ],
    },
    null,
    2
  );
};
