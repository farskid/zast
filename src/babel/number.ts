import t from "@babel/types";
import { ParseError } from "./utils";
import { Parser, ZastContext } from "./types";

export function parseNumber<C extends ZastContext>(
  context: C,
  value?: number
): Parser<number> {
  return {
    parse(node) {
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
