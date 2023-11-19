import { expectTypeOf } from "vitest";
import { getTestBabelInstance } from "../testUtils";
import { isStringLiteral } from "@babel/types";
import { Zast } from "../babel/zast";
import { ZastContext } from "../babel/types";

describe("z.", () => {
  const { z } = getTestBabelInstance("");
  it("z.string() should pass a string output", () => {
    expectTypeOf(z.string().parse).returns.toBeString();
  });
  it("z.string(string) should pass a string output", () => {
    expectTypeOf(z.string.bind(null, "john")().parse).returns.toBeString();
  });
  it("z.number() should pass a number ouput", () => {
    expectTypeOf(z.number().parse).returns.toBeNumber();
  });
  it("z.number(number) should pass a number output", () => {
    expectTypeOf(z.number.bind(null, 2)().parse).returns.toBeNumber();
  });
  it("z.boolean() should pass a boolean ouput", () => {
    expectTypeOf(z.boolean().parse).returns.toBeBoolean();
  });
  it("z.boolean(boolean) should pass a boolean output", () => {
    expectTypeOf(z.boolean.bind(null, false)().parse).returns.toBeBoolean();
  });
  it("z.identifier() should pass an identifier output", () => {
    expectTypeOf(z.identifier().parse).returns.toBeString();
  });
  it("z.identifier(identifier) should pass an identifier output", () => {
    expectTypeOf(z.identifier.bind(null, "john")().parse).returns.toBeString();
  });
  it("z.function() should pass either string or undefined as the output", () => {
    expectTypeOf(z.function().parse).returns.toEqualTypeOf<string | undefined>;
  });
  it('z.array(arr) should pass array item"s type', () => {
    expectTypeOf(z.array(z.string()).parse).returns.toEqualTypeOf<string[]>;
    expectTypeOf(z.array(z.number()).parse).returns.toEqualTypeOf<number[]>;
  });
  it('z.tuple(tuple) should pass tuple item"s type', () => {
    // Technically, (string | number)[] will also pass this test because it's assignable to [string, number] but we want tuple to have accurate output type
    expectTypeOf(z.tuple([z.string(), z.number()]).parse).returns.toEqualTypeOf<
      [string, number]
    >;
  });
  it("z.object(obj) should pass object type", () => {
    expectTypeOf(
      z.object({
        str: z.string(),
        num: z.number(),
        bool: z.boolean(),
        func: z.function(),
        arr: z.array(z.string()),
      }).parse
    ).returns.toEqualTypeOf<{
      str: string;
      num: number;
      bool: boolean;
      func: Function;
      arr: string[];
    }>;
  });
  it.skip("z.or(...schemas) should pass a union of provided schemas", () => {
    // expectTypeOf(
    //   z.or([
    //     z.string(),
    //     z.number(),
    //     z.boolean(),
    //     // z.function(),
    //     z.array(z.number()),
    //     z.object({
    //       id: z.string(),
    //     }),
    //   ]).parse
    // ).returns.toEqualTypeOf<string>;
  });
  it("z.custom should infer correct args and return values based on the passed parser", () => {
    const _z: Zast<ZastContext> = z;
    _z.custom("minLenString", (ctx, node, len?: number) => {
      if (
        isStringLiteral(node) &&
        len != undefined &&
        node.value.length > len
      ) {
        return node.value;
      }
    });

    expectTypeOf(_z.minLenString).parameters.toEqualTypeOf<[len?: number]>();
    expectTypeOf(_z.minLenString().parse).returns.toEqualTypeOf<string>;
  });
  it("z.custom should infer correct args and return values based on the passed parser", () => {
    const _z: Zast<ZastContext> = z;
    _z.custom(
      "inRangeString",
      (
        ctx,
        node,
        min: number = 0,
        max: number = 50,
        inclusive: boolean = false
      ) => {
        return isStringLiteral(node) ? node.value : undefined;
      }
    );

    expectTypeOf(_z.inRangeString).parameters.toEqualTypeOf<
      [min?: number, max?: number, inclusive?: boolean]
    >();
    expectTypeOf(_z.inRangeString().parse).returns.toEqualTypeOf<string>;
  });
});
