import t from "@babel/types";
import { ParseError } from "./utils";
import { Parser, ZastContext } from "./types";

export function parseIdentifier<C extends ZastContext>(
  context: C,
  options?: { name?: string }
): Parser<string> {
  return {
    parse(node) {
      if (!t.isIdentifier(node)) {
        throw new ParseError(
          node,
          "type mismatch, expected identifier but received"
        );
      }
      if (options?.name && node.name !== options.name) {
        throw new ParseError(node, "identifier name mismatch");
      }
      return node.name;
    },
  };
}
