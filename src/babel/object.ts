import { parseAny } from "./any";
import { Parser, ZastContext } from "./types";
import { ParseError, getObjectPropertyKey } from "./utils";
import t from "@babel/types";

export function parseObject<
  C extends ZastContext,
  I extends Record<string, unknown>
>(
  context: C,
  options?: {
    objSchema?: {
      [key in keyof I]: Parser<I[key]>;
    };
  }
): Parser<I> {
  return {
    parse(node) {
      if (!t.isObjectExpression(node)) {
        throw new ParseError(node);
      }

      const properties = node.properties.filter((p): p is t.ObjectProperty =>
        t.isObjectProperty(p)
      );

      if (properties.length !== node.properties.length) {
        throw new ParseError(
          node,
          "object contains non-object property elements"
        );
      }

      const out = {} as I;
      const foundKeys = new Set<string>();

      for (const prop of properties) {
        const key = getObjectPropertyKey(prop);
        const schema = options?.objSchema
          ? options.objSchema[key]
          : parseAny(context);
        if (options?.objSchema ? options.objSchema.hasOwnProperty(key) : true) {
          foundKeys.add(key);
          try {
            // @ts-expect-error todo
            out[key] = schema.parse(prop.value);
          } catch (err) {
            if (err instanceof ParseError) {
              err.node = prop.value;
              err.key = key;
              throw new AggregateError([
                err,
                `type mismatch in parsing "${key}"`,
              ]);
            }
            // TODO: we swallow errors like string value mismatch. Handle it so errors can be stacked
            // re-throw to include faulty key in the error message
            // throw new ParseError(
            //   prop.value,
            //   `type mismatch in parsing "${key}"`
            // );
          }
        }
      }

      if (options?.objSchema) {
        const schemaKeys = Object.keys(options.objSchema);
        for (const key of schemaKeys) {
          if (!foundKeys.has(key)) {
            throw new ParseError(node, `Missing key "${key}"`);
          }
        }
      }

      return out;
    },
  };
}
