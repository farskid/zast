import defaultStringParser from "./babel/string";
import defaultNumberParser from "./babel/number";
import defaultBooleanParser from "./babel/boolean";
import defaultIdentifierParser from "./babel/identifier";
import defaultFunctionParser from "./babel/function";
import defaultObjectParser from "./babel/object";
import defaultArrayParser from "./babel/array";
import defaultTupleParser from "./babel/tuple";
import defaultUnionParser from "./babel/union";

export const az = {
  string: defaultStringParser,
  number: defaultNumberParser,
  boolean: defaultBooleanParser,
  identifier: defaultIdentifierParser,
  function: defaultFunctionParser,
  object: defaultObjectParser,
  array: defaultArrayParser,
  tuple: defaultTupleParser,
  or: defaultUnionParser,
};
