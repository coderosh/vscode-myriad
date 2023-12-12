const { configs } = require("@coderosh/myriad");

class SyntaxGenerator {
  /**
   * @param {keyof configs} type
   */
  constructor(type) {
    this.type = type;
    this.config = configs[type];
  }

  get() {
    const syntax = {
      name: this.type,
      patterns: [
        {
          include: "#comments",
        },
        {
          include: "#entities",
        },
        {
          include: "#keywords",
        },
        {
          include: "#constants",
        },
        {
          include: "#punctuation",
        },
        {
          include: "#strings",
        },
        {
          match: "(\\w+)",
          name: `variable.name.${this.type}`,
        },
      ],
      repository: {
        comments: this.comments(),
        keywords: this.keywords(),
        constants: this.constants(),
        punctuation: this.punctuation(),
        entities: this.entities(),
        strings: this.strings(),
      },
      scopeName: `source.${this.type}`,
    };

    return syntax;
  }

  punctuation() {
    const symbols = Object.values(this.config.spSymbolConfig);

    const match = symbols
      .map((s) => {
        s = escape(s);
        return isAlpha(s) ? `\\b${s}\\b` : s;
      })
      .join("|");

    return {
      name: `punctuation.${this.type}`,
      match,
    };
  }

  constants() {
    const trueK = escape(this.config.keywordConfig.true);
    const falseK = escape(this.config.keywordConfig.false);
    const nullK = escape(this.config.keywordConfig.null);

    return {
      patterns: [
        {
          name: `constant.numeric.${this.type}`,
          match: "\\b([0-9]+)\\b",
        },
        {
          name: `constant.language.boolean.${this.type}`,
          match: `\\b(${trueK}|${falseK})\\b`,
        },
        {
          name: `constant.language.null.${this.type}`,
          match: `\\b(${nullK})\\b`,
        },
      ],
    };
  }

  keywords() {
    const keywords = this.config.keywordConfig;

    const controlMatch = [
      keywords.if,
      keywords.else,
      keywords.for,
      keywords.while,
      keywords.break,
      keywords.continue,
      keywords.return,
      keywords.fun,
      keywords.try,
      keywords.catch,
      keywords.import,
      keywords.export,
      keywords.throw,
      keywords.break,
    ]
      .map((k) => escape(k))
      .join("|");

    const storageMatch = [keywords.let, keywords.const, keywords.fun]
      .map((s) => escape(s))
      .join("|");

    const operators = Object.values(this.config.opConfig);

    const operatormatch = operators
      .map((o) => {
        o = escape(o);
        return isAlpha(o) ? `\\b${o}\\b` : o;
      })
      .join("|");

    return {
      patterns: [
        {
          name: `keyword.control.${this.type}`,
          match: `\\b(${controlMatch})\\b`,
        },
        {
          name: `storage.type.${this.type}`,
          match: `\\b(${storageMatch})\\b`,
        },
        {
          name: `keyword.operator.${this.type}`,
          match: operatormatch,
        },
      ],
    };
  }

  comments() {
    return {
      patterns: [
        {
          match: "//(.*)",
          name: `comment.line.double-dash.${this.type}`,
        },
        {
          begin: "/\\*",
          end: "\\*/",
          name: `comment.block.${this.type}`,
        },
      ],
    };
  }

  entities() {
    const fn = this.config.keywordConfig.fun;

    return {
      patterns: [
        {
          match: `(${fn}) +(\\w+)`,
          captures: {
            1: {
              name: `storage.type.${this.type}`,
            },
            2: {
              name: `entity.name.function.${this.type}`,
            },
          },
        },
        {
          match: `(\\w+)\\(`,
          captures: {
            1: {
              name: `entity.name.function.${this.type}`,
            },
          },
        },
      ],
    };
  }

  strings() {
    return {
      patterns: [
        {
          name: `string.quoted.double.${this.type}`,
          begin: '"',
          end: '"',
          patterns: [
            {
              name: `constant.character.escape.${this.type}`,
              match: "\\\\.",
            },
          ],
        },
        {
          name: `string.quoted.single.${this.type}`,
          begin: "'",
          end: "'",
          patterns: [
            {
              name: `constant.character.escape.${this.type}`,
              match: "\\\\.",
            },
          ],
        },
        {
          name: `string.quoted.other.${this.type}`,
          begin: "`",
          end: "`",
          patterns: [
            {
              name: `constant.character.escape.${this.type}`,
              match: "\\\\.",
            },
          ],
        },
      ],
    };
  }
}

function isAlpha(str) {
  return /^[A-Za-z]+$/.test(str);
}

function escape(str) {
  const specialCharacters = /[.*+?^${}()|[\]\\]/g;
  return str.replace(specialCharacters, "\\$&");
}

module.exports = function genSyntaxFile(type) {
  return JSON.stringify(new SyntaxGenerator(type).get(), null, 2);
};
