import t from "@babel/types";
import { ParseError } from "./utils";
import { Parser } from "./types";

export default function defaultBooleanParser(value?: boolean): Parser<boolean> {
  return {
    name: "boolean",
    parse: function booleanParser(node: t.Node) {
      if (!t.isBooleanLiteral(node)) {
        throw new ParseError(
          node,
          "type mismatch, expected boolean but received"
        );
      }
      if (value !== undefined && value !== node.value) {
        throw new ParseError(
          node,
          `boolean value mismatch, expected "${value}" but received`
        );
      }
      return node.value;
    },
  };
}
