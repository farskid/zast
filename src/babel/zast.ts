import { Node } from "@babel/types";
import { parseAny } from "./any";
import parseArray from "./array";
import { parseBoolean } from "./boolean";
import parseFunction from "./function";
import { parseIdentifier } from "./identifier";
import { parseNumber } from "./number";
import { parseObject } from "./object";
import { parseString } from "./string";
import parseTuple from "./tuple";
import { Parser, ZastContext } from "./types";
import defaultUnionParser from "./union";

export class Zast<
  Context extends ZastContext
  // CustomParsers extends Record<string, Parser<unknown>["parse"]>
> {
  private context: Context;
  constructor(
    context: Context
    // customParsers?: CustomParsers
  ) {
    this.context = context;
  }

  custom<
    TName extends string,
    TArgs extends unknown[],
    TVal
    // TBody extends (ctx: Context, node: Node, ...args: unknown[]) => unknown
  >(
    name: TName,
    body: (
      ctx: Context,
      node: Node,
      ...args: [...{ [key in keyof TArgs]: TArgs[key] }]
    ) => TVal
  ): asserts this is { [K in TName]: (...args: TArgs) => Parser<TVal> } {
    const ctx = this.context;

    (this as any)[name] = (
      ...args: [...{ [key in keyof TArgs]: TArgs[key] }]
    ): Parser<TVal> => ({
      parse(node) {
        return body(ctx, node, ...args);
      },
    });
  }

  any() {
    const ctx = this.context;
    return parseAny(ctx);
  }

  string(value?: string) {
    const ctx = this.context;
    return parseString(ctx, value);
  }

  number(value?: number) {
    const ctx = this.context;
    return parseNumber(ctx, value);
  }

  boolean(value?: boolean) {
    const ctx = this.context;
    return parseBoolean(ctx, value);
  }

  identifier(name?: string): Parser<string> {
    const ctx = this.context;
    return parseIdentifier(this.context, { name });
  }

  function(name?: string): Parser<string | undefined> {
    const ctx = this.context;
    return parseFunction(ctx, { name });
  }

  array<I>(itemsSchema?: Parser<I>) {
    const ctx = this.context;
    return parseArray(ctx, { itemsSchema });
  }

  tuple<I extends Array<unknown>>(
    itemsSchema?: [...{ [key in keyof I]: Parser<I[key]> }]
  ) {
    const ctx = this.context;
    return parseTuple(ctx, { itemsSchema });
  }

  object<I extends Record<string, unknown>>(objSchema?: {
    [key in keyof I]: Parser<I[key]>;
  }) {
    const ctx = this.context;
    return parseObject(ctx, { objSchema });
  }

  or<I extends unknown[]>(
    membersSchema: [...{ [key in keyof I]: Parser<I[key]> }]
  ) {
    const ctx = this.context;
    return defaultUnionParser(ctx, { membersSchema });
  }
}
