import babel from "@babel/parser";
import traverse from "@babel/traverse";
import { z } from "../babel";
import t from "@babel/types";

describe("babel", () => {
  describe("z.string()", () => {
    it("should pass for any string", () => {
      let node: t.Node | undefined;
      const file = babel.parse("const data = {name: 'john'}");
      traverse(file, {
        StringLiteral(path) {
          node = path.node;
        },
      });
      expect(z.string().parse(node!)).toBe("john");
    });
    it("should throw if type is not string", () => {
      let node: t.Node | undefined;
      const file = babel.parse("const data = {name: 2}");
      traverse(file, {
        NumericLiteral(path) {
          node = path.node;
        },
      });
      // toThrow expects a function
      expect(z.string().parse.bind(null, node!)).toThrow();
    });
    it("should pass for a string with specific value", () => {
      let node: t.Node | undefined;
      const file = babel.parse("const data = {name: 'andy'}");
      traverse(file, {
        StringLiteral(path) {
          node = path.node;
        },
      });
      expect(z.string("andy").parse(node!)).toBe("andy");
    });
    it("should throw for a string with specific value if string contains a different value", () => {
      let node: t.Node | undefined;
      const file = babel.parse("const data = {name: 'andy'}");
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
      let node: t.Node | undefined;
      const file = babel.parse("const data = {age: 22}");
      traverse(file, {
        NumericLiteral(path) {
          node = path.node;
        },
      });
      expect(z.number().parse(node!)).toBe(22);
    });
    it("should throw if type is not number", () => {
      let node: t.Node | undefined;
      const file = babel.parse("const data = {age: true}");
      traverse(file, {
        BooleanLiteral(path) {
          node = path.node;
        },
      });
      // toThrow expects a function
      expect(z.number().parse.bind(null, node!)).toThrow();
    });
    it("should pass for a number with specific value", () => {
      let node: t.Node | undefined;
      const file = babel.parse("const data = {age: 30}");
      traverse(file, {
        NumericLiteral(path) {
          node = path.node;
        },
      });
      expect(z.number(30).parse(node!)).toBe(30);
    });
    it("should throw for a number with specific value if number contains a different value", () => {
      let node: t.Node | undefined;
      const file = babel.parse("const data = {age: 30}");
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
        let node: t.Node | undefined;
        const file = babel.parse("const data = {isAdmin: true}");
        traverse(file, {
          BooleanLiteral(path) {
            node = path.node;
          },
        });
        expect(z.boolean().parse(node!)).toBe(true);
      });
      it("should throw if type is not boolean", () => {
        let node: t.Node | undefined;
        const file = babel.parse("const data = {isAdming: 'true'}");
        traverse(file, {
          BooleanLiteral(path) {
            node = path.node;
          },
        });
        // toThrow expects a function
        expect(z.boolean().parse.bind(null, node!)).toThrow();
      });
      it("should pass for a boolean with specific value", () => {
        let node: t.Node | undefined;
        const file = babel.parse("const data = {isAdming: false}");
        traverse(file, {
          BooleanLiteral(path) {
            node = path.node;
          },
        });
        expect(z.boolean(false).parse(node!)).toBe(false);
      });
      it("should throw for a boolean with specific value if boolean contains a different value", () => {
        let node: t.Node | undefined;
        const file = babel.parse("const data = {isAdmin: false}");
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
      const file = babel.parse("const user = {getSession: function() {}}");
      traverse(file, {
        FunctionExpression(path) {
          node = path.node;
        },
      });

      expect(z.function().parse(node!)).toBe(undefined);
    });
    it("should pass for an async function", () => {
      let node: t.Node | undefined;
      const file = babel.parse(
        "const user = {getSession: async function() {}}"
      );
      traverse(file, {
        FunctionExpression(path) {
          node = path.node;
        },
      });

      expect(z.function().parse(node!)).toBe(undefined);
    });
    it("should pass with function code if code is passed on", () => {
      let node: t.Node | undefined;
      const fileContent =
        "const user = {getSession: function() {return Promise.resolve(2)}}";
      const file = babel.parse(fileContent);
      traverse(file, {
        FunctionExpression(path) {
          node = path.node;
        },
      });

      expect(z.function({ code: fileContent }).parse(node!)).toBe(
        "function() {return Promise.resolve(2)}"
      );
    });
  });
  describe("z.array()", () => {
    it("should parse single type of elemens in array", () => {
      let node: t.Node | undefined;
      const fileContent = "const arr = [1,2,3]";
      const file = babel.parse(fileContent);
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
      const fileContent = "const arr = [1,'a', true]";
      const file = babel.parse(fileContent);
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
      const fileContent = "const arr = [1,'a', true]";
      const file = babel.parse(fileContent);
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
      const fileContent = "const arr = [1,[2,[3],[4,[5]]]]";
      const file = babel.parse(fileContent);
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
      const fileContent = "const arr = ['John Doe', 32, true]";
      const file = babel.parse(fileContent);
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
      const file = babel.parse(fileContent);
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
            test: z.function({ code: fileContent }),
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
      const file = babel.parse(fileContent);
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
        // , test: () => {} (uncomment when parser context is added and can carry fileContent for the whole parser instance)
      };`;
      const file = babel.parse(fileContent);
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
        // test: "() => {}",
      });
    });
  });
  describe("z.or()", () => {
    it("should return a union type of parsed values from provided schemas", () => {
      let node: t.Node | undefined;
      const fileContent = `const value = [1,'a',true,[1,2,3],{id: 'ss'}]`;
      const file = babel.parse(fileContent);
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
