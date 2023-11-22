import babel from "@babel/parser";
import traverse from "@babel/traverse";
import t from "@babel/types";
import { Zast } from "../babel/zast";
import { getTestBabelInstance } from "../testUtils";
import { ParseError } from "../babel/utils";

describe("babel defaults", () => {
  describe("z.string()", () => {
    it("should pass for any string", () => {
      const { z, file } = getTestBabelInstance({
        fileContent: "const data = {name: 'john'}",
      });
      let node: t.Node | undefined;
      traverse(file, {
        StringLiteral(path) {
          node = path.node;
        },
      });
      expect(z.string().parse(node!)).toBe("john");
    });
    it("should throw if type is not string", () => {
      const { z, file } = getTestBabelInstance({
        fileContent: "const data = {name: 2}",
      });
      let node: t.Node | undefined;
      traverse(file, {
        NumericLiteral(path) {
          node = path.node;
        },
      });
      // toThrow expects a function
      expect(z.string().parse.bind(null, node!)).toThrow();
    });
    it("should pass for a string with specific value", () => {
      const { z, file } = getTestBabelInstance({
        fileContent: "const data = {name: 'andy'}",
      });
      let node: t.Node | undefined;
      traverse(file, {
        StringLiteral(path) {
          node = path.node;
        },
      });
      expect(z.string("andy").parse(node!)).toBe("andy");
    });
    it("should throw for a string with specific value if string contains a different value", () => {
      const { z, file } = getTestBabelInstance({
        fileContent: "const data = {name: 'andy'}",
      });
      let node: t.Node | undefined;
      traverse(file, {
        StringLiteral(path) {
          node = path.node;
        },
      });
      // toThrow expects a function
      expect(z.string("john").parse.bind(null, node!)).toThrow();
    });
  });
  describe("z.number()", () => {
    it("should pass for any number", () => {
      const { z, file } = getTestBabelInstance({
        fileContent: "const data = {age: 22}",
      });
      let node: t.Node | undefined;
      traverse(file, {
        NumericLiteral(path) {
          node = path.node;
        },
      });
      expect(z.number().parse(node!)).toBe(22);
    });
    it("should throw if type is not number", () => {
      const { z, file } = getTestBabelInstance({
        fileContent: "const data = {age: true}",
      });
      let node: t.Node | undefined;
      traverse(file, {
        BooleanLiteral(path) {
          node = path.node;
        },
      });
      // toThrow expects a function
      expect(z.number().parse.bind(null, node!)).toThrow();
    });
    it("should pass for a number with specific value", () => {
      const { z, file } = getTestBabelInstance({
        fileContent: "const data = {age: 30}",
      });
      let node: t.Node | undefined;
      traverse(file, {
        NumericLiteral(path) {
          node = path.node;
        },
      });
      expect(z.number(30).parse(node!)).toBe(30);
    });
    it("should throw for a number with specific value if number contains a different value", () => {
      const { z, file } = getTestBabelInstance({
        fileContent: "const data = {age: 30}",
      });
      let node: t.Node | undefined;
      traverse(file, {
        NumericLiteral(path) {
          node = path.node;
        },
      });
      // toThrow expects a function
      expect(z.number(29).parse.bind(null, node!)).toThrow();
    });
    describe("z.boolean()", () => {
      it("should pass for any boolean", () => {
        const { z, file } = getTestBabelInstance({
          fileContent: "const data = {isAdmin: true}",
        });
        let node: t.Node | undefined;
        traverse(file, {
          BooleanLiteral(path) {
            node = path.node;
          },
        });
        expect(z.boolean().parse(node!)).toBe(true);
      });
      it("should throw if type is not boolean", () => {
        const { z, file } = getTestBabelInstance({
          fileContent: "const data = {isAdmin: 20}",
        });
        let node: t.Node | undefined;
        traverse(file, {
          BooleanLiteral(path) {
            node = path.node;
          },
        });
        // toThrow expects a function
        expect(z.boolean().parse.bind(null, node!)).toThrow();
      });
      it("should pass for a boolean with specific value", () => {
        const { z, file } = getTestBabelInstance({
          fileContent: "const data = {isAdmin: false}",
        });
        let node: t.Node | undefined;
        traverse(file, {
          BooleanLiteral(path) {
            node = path.node;
          },
        });
        expect(z.boolean(false).parse(node!)).toBe(false);
      });
      it("should throw for a boolean with specific value if boolean contains a different value", () => {
        const { z, file } = getTestBabelInstance({
          fileContent: "const data = {isAdmin: false}",
        });
        let node: t.Node | undefined;
        traverse(file, {
          BooleanLiteral(path) {
            node = path.node;
          },
        });
        // toThrow expects a function
        expect(z.boolean(true).parse.bind(null, node!)).toThrow();
      });
    });
  });
  describe.todo("z.identifier()");
  describe("z.function()", () => {
    it("should pass for a sync function", () => {
      let node: t.Node | undefined;
      const { z, file } = getTestBabelInstance({
        fileContent: "const user = {getSession: function() {}}",
      });
      traverse(file, {
        FunctionExpression(path) {
          node = path.node;
        },
      });

      expect(z.function().parse(node!)).toBe("function() {}");
    });
    it("should pass for an async function", () => {
      let node: t.Node | undefined;
      const { z, file } = getTestBabelInstance({
        fileContent: "const user = {getSession: async function() {}}",
      });
      traverse(file, {
        FunctionExpression(path) {
          node = path.node;
        },
      });

      expect(z.function().parse(node!)).toBe("async function() {}");
    });
    it("should pass with function code if code is passed on", () => {
      let node: t.Node | undefined;
      const { z, file } = getTestBabelInstance({
        fileContent:
          "const user = {getSession: function() {return Promise.resolve(2)}}",
      });
      traverse(file, {
        FunctionExpression(path) {
          node = path.node;
        },
      });

      expect(z.function().parse(node!)).toMatchInlineSnapshot(
        `"function() {return Promise.resolve(2)}"`
      );
    });
  });
  describe("z.array()", () => {
    it("should parse single type of elemens in array", () => {
      let node: t.Node | undefined;
      const { z, file } = getTestBabelInstance({
        fileContent: "const arr = [1,2,3]",
      });
      traverse(file, {
        ArrayExpression(path) {
          node = path.node;
        },
      });

      expect(z.array(z.number()).parse(node!)).toEqual([1, 2, 3]);
      expect(z.array(z.string()).parse.bind(null, node!)).toThrow();
    });
    it("should parse multiple types of elemens in array", () => {
      let node: t.Node | undefined;
      const { z, file } = getTestBabelInstance({
        fileContent: "const arr = [1,'a', true]",
      });
      traverse(file, {
        ArrayExpression(path) {
          node = path.node;
        },
      });

      expect(
        z.array(z.or([z.number(), z.string(), z.boolean()])).parse(node!)
      ).toEqual([1, "a", true]);
      expect(
        z.array(z.or([z.number(), z.boolean()])).parse.bind(null, node!)
      ).toThrow();
    });
    it("should parse any array", () => {
      let node: t.Node | undefined;
      const { z, file } = getTestBabelInstance({
        fileContent: "const arr = [1,'a', true]",
      });
      traverse(file, {
        ArrayExpression(path) {
          node = path.node;
        },
      });

      expect(z.array().parse(node!)).toEqual([1, "a", true]);
    });
    // Question for API design, how should this behave?
    it.skip("should parse nested arrays", () => {
      let node: t.Node | undefined;
      const { z, file } = getTestBabelInstance({
        fileContent: "const arr = [1,[2,[3],[4,[5]]]]",
      });
      traverse(file, {
        ArrayExpression(path) {
          if (!node) {
            node = path.node;
          }
        },
      });

      expect(
        z.array(z.or([z.number(), z.array(z.number())])).parse(node!)
      ).toEqual([1, [2, [3], [4, [5]]]]);
    });
  });
  describe("z.tuple()", () => {
    it("should parse tuples", () => {
      let node: t.Node | undefined;
      const { z, file } = getTestBabelInstance({
        fileContent: "const arr = ['John Doe', 32, true]",
      });
      traverse(file, {
        ArrayExpression(path) {
          node = path.node;
        },
      });

      expect(
        z.tuple([z.string(), z.number(), z.boolean()]).parse(node!)
      ).toEqual(["John Doe", 32, true]);
      expect(z.tuple([z.string()]).parse.bind(null, node!)).toThrow();
    });
  });
  describe("z.object()", () => {
    it("should pass for an exact object", () => {
      let node: t.Node | undefined;
      const fileContent =
        "const obj = {str: 'str', num: 2, bool: false, test: () => {}, arr: [1,2]}";
      const { z, file } = getTestBabelInstance({ fileContent });
      traverse(file, {
        ObjectExpression(path) {
          node = path.node;
        },
      });

      expect(
        z
          .object({
            str: z.string(),
            num: z.number(),
            bool: z.boolean(),
            test: z.function(),
            arr: z.array(z.number()),
          })
          .parse(node!)
      ).toEqual({
        str: "str",
        num: 2,
        bool: false,
        test: "() => {}",
        arr: [1, 2],
      });
    });
    it("should work with nested objects", () => {
      let node: t.Node | undefined;
      const fileContent = `const obj = {
          a: {
            b: "str",
            c: {
              d: 2,
            },
          },
        }`;
      const { z, file } = getTestBabelInstance({ fileContent });
      traverse(file, {
        ObjectExpression(path) {
          // We only want the root object
          if (!node!) {
            node = path.node;
          }
        },
      });

      expect(
        z
          .object({
            a: z.object({
              b: z.string(),
              c: z.object({
                d: z.number(),
              }),
            }),
          })
          .parse(node!)
      ).toEqual({
        a: {
          b: "str",
          c: {
            d: 2,
          },
        },
      });
    });
    it("should pass for any object", () => {
      let node: t.Node | undefined;
      const fileContent = `const obj = {
        str: "str",
        num: 2,
        bool: false,
        arr: [1, 2],
        test: () => {}
      };`;
      const { z, file } = getTestBabelInstance({ fileContent });
      traverse(file, {
        ObjectExpression(path) {
          node = path.node;
        },
      });

      expect(z.object().parse(node!)).toEqual({
        str: "str",
        num: 2,
        bool: false,
        arr: [1, 2],
        test: "() => {}",
      });
    });
  });
  describe("z.or()", () => {
    it("should return a union type of parsed values from provided schemas", () => {
      let node: t.Node | undefined;
      const fileContent = `const value = [1,'a',true,[1,2,3],{id: 'ss'}]`;
      const { z, file } = getTestBabelInstance({ fileContent });
      traverse(file, {
        ArrayExpression(path) {
          // We only want the root object
          if (!node!) {
            node = path.node;
          }
        },
      });

      expect(
        z
          .array(
            z.or([z.string(), z.number(), z.boolean(), z.array(), z.object()])
          )
          .parse(node!)
      ).toEqual([1, "a", true, [1, 2, 3], { id: "ss" }]);
    });
  });
});

describe("babel custom parser", () => {
  it("should allow creating custom parsers", () => {
    const z = Zast(
      {
        fileContent: 'const longStr = "pretend very long str"',
      },
      {
        minLenString: (ctx, node, len: number = 10) => {
          if (t.isStringLiteral(node) && node.value.length > len) {
            return node.value;
          }
          throw new ParseError(
            node,
            `string is less than ${len} characters long`
          );
        },
      }
    );
    const file = babel.parse('const longStr = "pretend very long str"');

    let node: t.Node | undefined;
    traverse(file, {
      StringLiteral(path) {
        if (!node!) {
          node = path.node;
        }
      },
    });

    expect(z.minLenString(15).parse(node!)).toEqual("pretend very long str");
  });

  it("should allow creating custom parsers", () => {
    const z = Zast(
      {
        fileContent: 'const longStr = "pretend very long str"',
      },
      {
        inRangeString: (
          ctx,
          node,
          min: number = 0,
          max: number = 50,
          inclusive: boolean = false
        ) => {
          if (
            t.isStringLiteral(node) &&
            (inclusive ? node.value.length >= min : node.value.length > min) &&
            (inclusive ? node.value.length <= max : node.value.length < max)
          ) {
            return node.value;
          }
          throw new ParseError(
            node,
            `string does not have a length between ${min} and ${max}, ${
              inclusive ? "inclusive" : "non-inclusive"
            }`
          );
        },
      }
    );

    const file = babel.parse('const longStr = "pretend very long str"');

    let node: t.Node | undefined;
    traverse(file, {
      StringLiteral(path) {
        if (!node!) {
          node = path.node;
        }
      },
    });

    expect(z.inRangeString(5, 100, true).parse(node!)).toEqual(
      "pretend very long str"
    );
    expect(z.inRangeString().parse(node!)).toEqual("pretend very long str");
    expect(z.inRangeString(50, 80).parse.bind(null, node!)).toThrow();
  });
});
