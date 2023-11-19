# Zast: Zod of AST parsing

Parses an AST node against a schema and returns the parsed value if schema parsing passes successfully, otherwise throws an error.

## Roadmap

- [x] Babel AST
- [ ] TypeScript AST

## API

Zast is class-base/d. You need to create an instance with an optional context before using any parsers.
Each Zast instance ships with a fixed set of basic parsers of following list.

- `z.string()` matches any string and returns its value
- `z.string('John')` matches any string with exact value "John" and returns its value
- `z.number()` matches any number
- `z.number(30)` matches any number with exact value 30
- `z.boolean()` matches any boolean
- `z.boolean(true)` matches any boolean with exact value `true`
- `z.array()` matches any array
- `z.array(z.number())` matches any array of numbers
- `z.array(z.or([z.string(), z.number()]))` matches any array containing either strings or numbers
- `z.tuple([z.string(), z.number()])` matches any array of shape [string, number] with exact length 2 and exact item types in place
- `z.object()` matches any object
- `z.object(shape)`:

```ts
z.object({
  str: z.string(),
  num: z.number(),
  arr: z.array(z.boolean()),
  obj: z.object({
    anotherProp: z.string(),
  }),
});
```

matches an **exact** object of shape:

```ts
{
  str: string,
  num: number,
  arr: number[],
  obj: {
    anotherProp: string
  }
}
```

- `z.function()` matches any function

- `z.or(schema[])` matches if any of the schemas match, the first match wins

  - `z.or(z.string(), z.number()).parse(SringLiternalNode)` passes and returns the string value

- `z.custom` allows creating ad-hoc parsers.

```ts
const z: Zast = new Zast({
  fileContent: 'const str = "pretend very long str"',
});

z.custom(
  "inRangeString",
  (
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
  }
);

z.inRangeString(5, 100, true).parse(stringNode); // will pass and return the string value
```

## Development

- Run unit tests: `yarn test`
- Run type checking tests: `yarn test-types`
