# AstZod: Zod of AST parsing

Parses an AST node against a schema and returns the parsed value if schema parsing passes successfully, otherwise throws an error.

## Roadmap

- [x] Babel AST
- [ ] TypeScript AST

## API

### Babel AST

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

## Development

- Run unit tests: `yarn test`
- Run type checking tests: `yarn test-types`
