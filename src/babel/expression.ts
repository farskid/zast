import t from "@babel/types";
import { ParseError } from "./utils";
import { z } from "../babel";

export default function defaultExpressionParser() {
  return {
    name: "expression",
    parse: function expressionParser(node: t.Node) {
      if (!t.isExpression(node)) {
        throw new ParseError(
          node,
          "type mismatch, expected expression but received"
        );
      }
      return z
        .or([
          z.string(),
          z.number(),
          z.boolean(),
          z.array(),
          z.function(),
          z.object(),
        ])
        .parse(node);
    },
  };
}
