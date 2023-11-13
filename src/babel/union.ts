import { Parser } from "./types";
import { ParseError } from "./utils";
import t from "@babel/types";

export default function defaultUnionParser<I extends Array<unknown>>(
  schemas: [...{ [key in keyof I]: Parser<I[key]> }]
): Parser<I[number]> {
  return {
    name: "or",
    parse: function orParser(node: t.Node) {
      for (const schema of schemas) {
        try {
          const value = schema.parse(node);
          return value;
        } catch {}
      }
      throw new ParseError(node, "or did not match any of the variants");
    },
  };
}
