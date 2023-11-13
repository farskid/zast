import { parseAny } from "./any";
import { Parser, ZastContext } from "./types";
import { ParseError } from "./utils";
import t from "@babel/types";

export default function parseArray<C extends ZastContext, I>(
  context: C,
  options?: { itemsSchema?: Parser<I> }
): Parser<I[]> {
  return {
    parse(node) {
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
            options?.itemsSchema
              ? options.itemsSchema.parse(item)
              : parseAny(context).parse(item)
          );
        }
      }

      return out;
    },
  };
}
