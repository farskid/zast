import t from "@babel/types";
import { ParseError } from "./utils";
import { Parser } from "./types";

export default function defaultIdentifierParser(name?: string): Parser<string> {
  return {
    name: "identifier",
    parse: function identifierParser(node: t.Node) {
      if (!t.isIdentifier(node)) {
        throw new ParseError(
          node,
          "type mismatch, expected identifier but received"
        );
      }
      if (name && node.name !== name) {
        throw new ParseError(node, "identifier name mismatch");
      }
      return node.name;
    },
  };
}
