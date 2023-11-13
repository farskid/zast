import { parseAny } from "./any";
import { Parser, ZastContext } from "./types";
import { ParseError } from "./utils";
import t from "@babel/types";

export default function parseTuple<
  C extends ZastContext,
  I extends Array<unknown>
>(
  context: C,
  options?: { itemsSchema?: [...{ [key in keyof I]: Parser<I[key]> }] }
): Parser<I> {
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

      const out = [] as unknown as I;
      for (let i = 0; i < node.elements.length; i++) {
        const item = node.elements[i];
        if (item) {
          out.push(
            options?.itemsSchema
              ? options.itemsSchema[i].parse(item)
              : parseAny(context).parse(item)
          );
        }
      }

      return out;
    },
  };
}
