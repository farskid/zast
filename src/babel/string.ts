import t from "@babel/types";
import { ParseError } from "./utils";
import { Parser } from "./types";

export default function defaultStringParser(value?: string): Parser<string> {
  return {
    name: "string",
    parse: function stringParser(node: t.Node) {
      if (!t.isStringLiteral(node)) {
        throw new ParseError(
          node,
          "type mismatch, expected string but received"
        );
      }
      if (value !== undefined && value !== node.value) {
        throw new ParseError(
          node,
          `string value mismatch, expected "${value}" but received`
        );
      }
      return node.value;
    },
  };
}
