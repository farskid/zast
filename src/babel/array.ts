import defaultExpressionParser from "./expression";
import { Parser } from "./types";
import { ParseError } from "./utils";
import t from "@babel/types";

export default function defaultArrayParser<I>(itemSchema?: Parser<I>) {
  return {
    name: "array",
    parse: function arrayParser(node: t.Node) {
      if (!t.isArrayExpression(node)) {
        throw new ParseError(node);
      }

      const elements = node.elements.filter((el): el is t.Expression =>
        t.isExpression(el)
      );

      if (elements.length !== node.elements.length) {
        throw new ParseError(node, "array contains non-expression elements");
      }

      // Handle arrays with expressions [1,...rest]

      const out: I[] = [];
      for (const item of node.elements) {
        if (item && t.isExpression(item)) {
          out.push(
            itemSchema
              ? itemSchema.parse(item)
              : (defaultExpressionParser().parse(item) as any)
          );
        }
      }

      return out;
    },
  };
}
