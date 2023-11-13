import t from "@babel/types";
import { ParseError } from "./utils";
import { Parser, ZastContext } from "./types";

export function parseBoolean<C extends ZastContext>(
  context: C,
  value?: boolean
): Parser<boolean> {
  return {
    parse(node) {
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
