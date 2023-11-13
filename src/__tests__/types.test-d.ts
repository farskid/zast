import { expectTypeOf } from "vitest";
import { az } from "../babel";

describe("az.", () => {
  it("az.string() should infer a string output", () => {
    expectTypeOf(az.string().parse).returns.toBeString();
  });
  it("az.string(string) should infer a string output", () => {
    expectTypeOf(az.string.bind(null, "john")().parse).returns.toBeString();
  });
  it("az.number() should infer a number ouput", () => {
    expectTypeOf(az.number().parse).returns.toBeNumber();
  });
  it("az.number(number) should infer a number output", () => {
    expectTypeOf(az.number.bind(null, 2)().parse).returns.toBeNumber();
  });
  it("az.boolean() should infer a boolean ouput", () => {
    expectTypeOf(az.boolean().parse).returns.toBeBoolean();
  });
  it("az.boolean(boolean) should infer a boolean output", () => {
    expectTypeOf(az.boolean.bind(null, false)().parse).returns.toBeBoolean();
  });
  it("az.identifier() should infer an identifier output", () => {
    expectTypeOf(az.identifier().parse).returns.toBeString();
  });
  it("az.identifier(identifier) should infer an identifier output", () => {
    expectTypeOf(az.identifier.bind(null, "john")().parse).returns.toBeString();
  });
  it("az.function() should infer either string or undefined as the output", () => {
    expectTypeOf(az.function().parse).returns.toEqualTypeOf<string | undefined>;
  });
  it('az.array(arr) should infer array item"s type', () => {
    expectTypeOf(az.array(az.string()).parse).returns.toEqualTypeOf<string[]>;
    expectTypeOf(az.array(az.number()).parse).returns.toEqualTypeOf<number[]>;
  });
  it('az.tuple(tuple) should infer tuple item"s type', () => {
    // Technically, (string | number)[] will also pass this test because it's assignable to [string, number] but we want tuple to have accurate output type
    expectTypeOf(az.tuple([az.string(), az.number()]).parse).returns
      .toEqualTypeOf<[string, number]>;
  });
  it("az.object(obj) should infer object type", () => {
    expectTypeOf(
      az.object({
        str: az.string(),
        num: az.number(),
        bool: az.boolean(),
        func: az.function(),
        arr: az.array(az.string()),
      }).parse
    ).returns.toEqualTypeOf<{
      str: string;
      num: number;
      bool: boolean;
      func: Function;
      arr: string[];
    }>;
  });
  it("az.or(...schemas) should infer a union of provided schemas", () => {
    // expectTypeOf(
    //   az.or([
    //     az.string(),
    //     az.number(),
    //     az.boolean(),
    //     // az.function(),
    //     az.array(az.number()),
    //     az.object({
    //       id: az.string(),
    //     }),
    //   ]).parse
    // ).returns.toEqualTypeOf<string>;
  });
});
