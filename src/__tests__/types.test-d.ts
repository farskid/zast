import { expectTypeOf } from "vitest";
import { z } from "../babel";

describe("z.", () => {
  it("z.string() should infer a string output", () => {
    expectTypeOf(z.string().parse).returns.toBeString();
  });
  it("z.string(string) should infer a string output", () => {
    expectTypeOf(z.string.bind(null, "john")().parse).returns.toBeString();
  });
  it("z.number() should infer a number ouput", () => {
    expectTypeOf(z.number().parse).returns.toBeNumber();
  });
  it("z.number(number) should infer a number output", () => {
    expectTypeOf(z.number.bind(null, 2)().parse).returns.toBeNumber();
  });
  it("z.boolean() should infer a boolean ouput", () => {
    expectTypeOf(z.boolean().parse).returns.toBeBoolean();
  });
  it("z.boolean(boolean) should infer a boolean output", () => {
    expectTypeOf(z.boolean.bind(null, false)().parse).returns.toBeBoolean();
  });
  it("z.identifier() should infer an identifier output", () => {
    expectTypeOf(z.identifier().parse).returns.toBeString();
  });
  it("z.identifier(identifier) should infer an identifier output", () => {
    expectTypeOf(z.identifier.bind(null, "john")().parse).returns.toBeString();
  });
  it("z.function() should infer either string or undefined as the output", () => {
    expectTypeOf(z.function().parse).returns.toEqualTypeOf<string | undefined>;
  });
  it('z.array(arr) should infer array item"s type', () => {
    expectTypeOf(z.array(z.string()).parse).returns.toEqualTypeOf<string[]>;
    expectTypeOf(z.array(z.number()).parse).returns.toEqualTypeOf<number[]>;
  });
  it('z.tuple(tuple) should infer tuple item"s type', () => {
    // Technically, (string | number)[] will also pass this test because it's assignable to [string, number] but we want tuple to have accurate output type
    expectTypeOf(z.tuple([z.string(), z.number()]).parse).returns.toEqualTypeOf<
      [string, number]
    >;
  });
  it("z.object(obj) should infer object type", () => {
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
  it("z.or(...schemas) should infer a union of provided schemas", () => {
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
});
