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
import { parseUnion } from "./union";

interface BaseParsers {
  any(): Parser<any>;
  string(value?: string): Parser<string>;
  number(value?: number): Parser<number>;
  boolean(value?: boolean): Parser<boolean>;
  identifier(name?: string): Parser<string>;
  function(name?: string): Parser<string | undefined>;
  array<I>(itemsSchema?: Parser<I>): Parser<I[]>;
  tuple<I extends Array<unknown>>(
    itemsSchema?: [...{ [key in keyof I]: Parser<I[key]> }]
  ): Parser<unknown>;
  object<I extends Record<string, unknown>>(objSchema?: {
    [key in keyof I]: Parser<I[key]>;
  }): Parser<I>;
  or<I extends unknown[]>(
    membersSchema: [...{ [key in keyof I]: Parser<I[key]> }]
  ): Parser<unknown>;
}

type ParametersExceptFirstAndSecond<F> = F extends (
  arg0: any,
  arg1: any,
  ...rest: infer R
) => any
  ? R
  : never;

export function Zast<
  TContext extends ZastContext,
  TParsers extends Record<
    string,
    (ctx: TContext, node: Node, ...args: never[]) => unknown
  >
>(
  context: TContext,
  customParsers?: TParsers
): BaseParsers & {
  [K in keyof TParsers]: (
    ...args: ParametersExceptFirstAndSecond<TParsers[K]>
  ) => Parser<ReturnType<TParsers[K]>>;
} {
  const baseParsers = {
    any() {
      return parseAny(context);
    },

    string(value?: string) {
      return parseString(context, value);
    },

    number(value?: number) {
      return parseNumber(context, value);
    },

    boolean(value?: boolean) {
      return parseBoolean(context, value);
    },

    identifier(name?: string): Parser<string> {
      return parseIdentifier(context, { name });
    },

    function(name?: string): Parser<string | undefined> {
      return parseFunction(context, { name });
    },

    array<I>(itemsSchema?: Parser<I>) {
      return parseArray(context, { itemsSchema });
    },

    tuple<I extends Array<unknown>>(
      itemsSchema?: [...{ [key in keyof I]: Parser<I[key]> }]
    ) {
      return parseTuple(context, { itemsSchema });
    },

    object<I extends Record<string, unknown>>(objSchema?: {
      [key in keyof I]: Parser<I[key]>;
    }) {
      return parseObject(context, { objSchema });
    },

    or<I extends unknown[]>(
      membersSchema: [...{ [key in keyof I]: Parser<I[key]> }]
    ) {
      return parseUnion(context, { membersSchema });
    },
  };

  const customMethods = {} as {
    [K in keyof TParsers]: (
      ...args: ParametersExceptFirstAndSecond<TParsers[K]>
    ) => Parser<ReturnType<TParsers[K]>>;
  };
  for (const name in customParsers) {
    customMethods[name] = (
      ...args: ParametersExceptFirstAndSecond<TParsers[string]>
    ) => ({
      parse(node) {
        return customParsers[name](context, node, ...args) as ReturnType<
          TParsers[string]
        >;
      },
    });
  }

  return {
    ...baseParsers,
    ...customMethods,
  };
}
