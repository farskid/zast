import { Parser } from "./types";
import { ParseError } from "./utils";
import t from "@babel/types";

export default function defaultTupleParser<I extends Array<unknown>>(
  schemas: [...{ [key in keyof I]: Parser<I[key]> }]
): Parser<I> {
  return {
    name: "array",
    parse: function tupleParser(node: t.Node) {
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
          out.push(schemas[i].parse(item));
        }
      }

      return out;
    },
  };
}
