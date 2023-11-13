import t from "@babel/types";

export class ParseError extends Error {
  public node: t.Node;
  public key?: string;
  constructor(node: t.Node, message?: string) {
    super();
    this.message = "Error parsing AST schema";
    if (message) {
      this.message += `: ${message}`;
    }
    this.node = node;
  }
  toString() {
    // console.error(this.message, this.node);
    return this.message;
  }
}

export const getObjectPropertyKey = (prop: t.ObjectProperty): string => {
  if (t.isIdentifier(prop.key)) {
    return prop.key.name;
  }
  if (t.isStringLiteral(prop.key) || t.isNumericLiteral(prop.key)) {
    return prop.key.value.toString();
  }
  throw Error(`Can not access prop.key for property ${JSON.stringify(prop)}`);
};
