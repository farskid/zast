import t from "@babel/types";
import { Parser } from "./types";
import { ParseError } from "./utils";

export default function defaultFunctionParser(options?: {
  code?: string; // TODO: move to the parser context
  name?: string;
}): Parser<string | undefined> {
  return {
    name: "function",
    parse: function functionParser(node: t.Node) {
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

      // If no code is provided, schema just passes
      return options?.code?.slice(node.start!, node.end!);
    },
  };
}
