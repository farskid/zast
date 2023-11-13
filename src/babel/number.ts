import t from "@babel/types";
import { ParseError } from "./utils";
import { Parser } from "./types";

export default function defaultNumberParser(value?: number): Parser<number> {
  return {
    name: "number",
    parse: function numberParser(node: t.Node) {
      if (!t.isNumericLiteral(node)) {
        throw new ParseError(
          node,
          "type mismatch, expected number but received"
        );
      }
      if (value !== undefined && value !== node.value) {
        throw new ParseError(
          node,
          `number value mismatch, expected "${value}" but received`
        );
      }
      return node.value;
    },
  };
}
