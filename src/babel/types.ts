import t from "@babel/types";

export type Parser<Value> = {
  name: string;
  parse(node: t.Node): Value;
};
