import { Parser, ZastContext } from "./types";
import { ParseError } from "./utils";
import t from "@babel/types";

export default function defaultUnionParser<
  C extends ZastContext,
  I extends Array<unknown>
>(
  context: C,
  options: {
    membersSchema: [...{ [key in keyof I]: Parser<I[key]> }];
  }
): Parser<I[number]> {
  return {
    parse: function orParser(node) {
      for (const schema of options.membersSchema) {
        try {
          const value = schema.parse(node);
          return value;
        } catch {}
      }
      throw new ParseError(node, "or did not match any of the variants");
    },
  };
}
