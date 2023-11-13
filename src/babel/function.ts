import t from "@babel/types";
import { Parser, ZastContext } from "./types";
import { ParseError } from "./utils";

export default function parseFunction<C extends ZastContext>(
  context: C,
  options?: {
    name?: string;
  }
): Parser<string | undefined> {
  return {
    parse(node) {
      if (!t.isFunctionExpression(node) && !t.isArrowFunctionExpression(node)) {
        throw new ParseError(
          node,
          "type mismatch, expected function but received"
        );
      }
      if (options?.name) {
        if (!t.isFunctionExpression(node)) {
          throw new ParseError(
            node,
            "named functions can only be checked against FunctionExpressions"
          );
        }
        if (node.id && options.name !== node.id.name) {
          throw new ParseError(node, "function name mismatch");
        }
      }

      return context.fileContent.slice(node.start!, node.end!);
    },
  };
}
