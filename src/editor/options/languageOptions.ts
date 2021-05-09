/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable no-template-curly-in-string */
import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

const languageConfigurations = (monaco: typeof Monaco.languages): Monaco.languages.LanguageConfiguration => {
  return {
    autoClosingPairs: [
      { open: "<", close: ">" },
      { open: "$(", close: ")" },
      { open: '"', close: '"', notIn: ["string"] },
      { open: "'", close: "'", notIn: ["string", "comment"] },
      { open: "/**", close: " */", notIn: ["string"] },
      { open: "OP_IF", close: " OP_ENDIF", notIn: ["string", "comment"] },
      { open: "OP_NOTIF", close: " OP_ENDIF", notIn: ["string", "comment"] },
    ],
    brackets: [
      ["<", ">"],
      ["$(", ")"],
    ],
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"],
    },
    onEnterRules: [
      {
        // e.g. /** | */
        beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
        afterText: /^\s*\*\/$/,
        action: {
          indentAction: monaco.IndentAction.IndentOutdent,
          appendText: " * ",
        },
      },
      {
        // e.g. /** ...|
        beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
        action: {
          indentAction: monaco.IndentAction.None,
          appendText: " * ",
        },
      },
      {
        // e.g.  * ...|
        beforeText: /^(\t|[ ])*[ ]\*([ ]([^*]|\*(?!\/))*)?$/,
        afterText: /^(\s*(\/\*\*|\*)).*/,
        action: {
          indentAction: monaco.IndentAction.None,
          appendText: "* ",
        },
      },
      {
        // e.g.  */|
        beforeText: /^(\t|[ ])*[ ]\*\/\s*$/,
        action: {
          indentAction: monaco.IndentAction.None,
          removeText: 1,
        },
      },
      {
        // e.g.  *-----*/|
        beforeText: /^(\t|[ ])*[ ]\*[^/]*\*\/\s*$/,
        action: {
          indentAction: monaco.IndentAction.None,
          removeText: 1,
        },
      },
    ],
  };
};

const tokenProviders: Monaco.languages.IMonarchLanguage = {
  bigint: /-?\d+(_+\d+)*/,
  brackets: [
    { open: "$(", close: ")", token: "delimiter.evaluation" },
    { open: "<", close: ">", token: "delimiter.push" },
  ],
  binary: /[01]+(?:[01_]*[01]+)*/,
  hex: /[0-9a-fA-F]_*(?:_*[0-9a-fA-F]_*[0-9a-fA-F]_*)*[0-9a-fA-F]/,
  tokenizer: {
    root: [
      // [/0b(@binary)/, "literal.binary"], // BinaryLiteral
      [
        /[a-zA-Z_][.a-zA-Z0-9_-]+/,
        {
          cases: {
            // "@flowControlOpcodes": "opcode.flow-control",
            // "@signatureCheckingOpcodes": "opcode.signature",
            // "@blockingOpcodes": "opcode.blocking",
            // "@pushBytesOpcodes": "opcode.push",
            // "@pushNumberOpcodes": "opcode.push-number",
            // "@disabledOpcodes": "opcode.disabled",
            // "@otherOpcodes": "opcode.other",
            "@default": "identifier",
          },
        },
      ],
      [/0x(@hex)/, "literal.hex"], // HexLiteral
      [/(@bigint)/, "literal.bigint"], // BigIntLiteral
      { include: "@whitespace" },
      [/[<>)]|\$\(/, "@brackets"],
      [/"/, "string", "@string_double"], // UTF8Literal
      [/'/, "string", "@string_single"], // UTF8Literal
    ],
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
    ],
    comment: [
      [/[^/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[/*]/, "comment"],
    ],
    string_double: [
      [/[^"$]+/, "string"],
      [/"/, "string", "@pop"],
    ],
    string_single: [
      [/[^'$]+/, "string"],
      [/'/, "string", "@pop"],
    ],
  },
};

const hoverProvider = {
  provideHover: function (model: any) {
    return {
      range: new Monaco.Range(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())),
      contents: [{ value: "**SOURCE**" }, { value: "Hello world" }],
    };
  },
};

const languageSuggestions = (monaco: typeof Monaco.languages): Monaco.languages.CompletionItem[] => {
  return [
    {
      label: "OP_ADD",
      kind: monaco.CompletionItemKind.Text,
      insertText: "OP_ADD",
      range: {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1,
      },
    },
    {
      label: "OP_SUB",
      kind: monaco.CompletionItemKind.Keyword,
      insertText: "testing(${1:condition})",
      insertTextRules: monaco.CompletionItemInsertTextRule.InsertAsSnippet,
      range: {
        startLineNumber: 2,
        startColumn: 2,
        endLineNumber: 2,
        endColumn: 2,
      },
    },
    {
      label: "OP_SHA256",
      kind: monaco.CompletionItemKind.Snippet,
      insertText: ["if (${1:condition}) {", "\t$0", "} else {", "\t", "}"].join("\n"),
      insertTextRules: monaco.CompletionItemInsertTextRule.InsertAsSnippet,
      documentation: "If-Else Statement",
      range: {
        startLineNumber: 0,
        startColumn: 0,
        endLineNumber: 0,
        endColumn: 0,
      },
    },
  ];
};

export { languageConfigurations, tokenProviders, hoverProvider, languageSuggestions };
