import t from "@babel/types";
import { parseBoolean } from "./boolean";
import { parseNumber } from "./number";
import { parseString } from "./string";
import { Parser, ZastContext } from "./types";
import { ParseError } from "./utils";
import parseArray from "./array";

export function parseAny<C extends ZastContext>(context: C): Parser<any> {
  return {
    parse(node) {
      if (!t.isExpression(node)) {
        throw new ParseError(
          node,
          "type mismatch, expected expression but received"
        );
      }
      if (t.isStringLiteral(node)) {
        return parseString(context).parse(node);
      }
      if (t.isNumericLiteral(node)) {
        return parseNumber(context).parse(node);
      }
      if (t.isBooleanLiteral(node)) {
        return parseBoolean(context).parse(node);
      }
      if (t.isArrayExpression(node)) {
        return parseArray(context).parse(node);
      }
      //   if (t.isObjectExpression(node)) {
      //     return parseObject(context).parse(node);
      //   }
    },
  };
}
