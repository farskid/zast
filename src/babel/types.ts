import t from "@babel/types";

export type ZastContext = { fileContent: string; [key: string]: unknown };
export type Parser<Value> = {
  parse(node: t.Node): Value;
};
