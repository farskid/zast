import t from "@babel/types";
import { ParseError } from "./utils";
import { az } from "../babel";

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
      return az
        .or([
          az.string(),
          az.number(),
          az.boolean(),
          az.array(),
          az.function(),
          az.object(),
        ])
        .parse(node);
    },
  };
}
