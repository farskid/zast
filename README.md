# AstZod: Zod of AST parsing

Parses an AST node against a schema and returns the parsed value if schema parsing passes successfully, otherwise throws an error.

## Roadmap

- [x] Babel AST
- [ ] TypeScript AST

## API

### Babel AST

- `az.string()` matches any string
- `az.string('John')` matches any string with exact value "John"
- `az.number()` matches any number
- `az.number(30)` matches any number with exact value 30
- `az.boolean()` matches any boolean
- `az.boolean(true)` matches any boolean with exact value `true`
- `az.array()` matches any array
- `az.array(az.number())` matches any array of numbers
- `az.array(az.or([az.string(), az.number()]))` matches any array containing either strings or numbers
- `az.tuple([az.string(), az.number()])` matches any array of shape [string, number] with exact length 2 and exact item types in place
- `az.object()` matches any object
- `az.object(shape)`:

```ts
az.object({
  str: az.string(),
  num: az.number(),
  arr: az.array(az.boolean()),
  obj: az.object({
    anotherProp: az.string(),
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

- `az.function()` matches any function

- `az.or(schema[])` matches if any of the schemas match, the first match wins
  - `az.or(az.string(), az.number()).parse(SringLiternalNode)` passes and returns the string value

## Development

- Run unit tests: `yarn test`
- Run type checking tests: `yarn test-types`
