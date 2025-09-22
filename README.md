# get-json-type
[![npm](https://img.shields.io/npm/v/get-json-type)](https://www.npmjs.com/package/get-json-type)
[![Types](https://img.shields.io/npm/types/get-json-type.svg)](https://www.npmjs.com/package/get-json-type)
[![Checks](https://img.shields.io/github/checks-status/a16n-dev/get-json-type/main)](https://www.npmjs.com/package/get-json-type)

Does exactly what it says on the tin: generates a typescript type for any JSON input:

```ts
import { getJsonType } from "get-json-type";

console.log(getJsonType("hello world"));
// Output: 'string'

console.log(getJsonType([42, null]));
// Output: '(number | null)[]'

console.log(getJsonType({ foo: "bar", baz: [1, 2, 3] }));
// Output: '{ foo: string; baz: number[] }'
```

`getJsonType` also accepts an optional second argument for options:

```ts
getJsonType({ foo: "bar", baz: [1, 2, 3] }, {
    multiline: true,
    indentSize: 2,
    typeName: "MyType"
})
// Output:
// type MyType = {
//   foo: string;
//   baz: number[];
// }
```

## Options

All options are optional. The available options are:

|Option|type|default| description                                                                                                                                           |
|------|----|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
|multiline|boolean|`false`| If true, formats the output type with newlines and indentation.                                                                                       |
|indentSize|number|`2`| Number of spaces to use for indentation when multiline is true.                                                                                       |
|typeName|string|`undefined`| If provided, wraps the output type in a type alias with the given name.                                                                               |
|throwOnUnknown|boolean|`false`| If true, throws an error when encountering a value that isn't valid JSON (e.g., functions, symbols). If false, these values are represented as `any`. |
|useLiteralTypes|boolean|`false`| If true, uses literal types for string, number, and boolean values (e.g., `"hello"` instead of `string`, `42` instead of `number`).                   |
## Development

To build the project, run:

```
pnpm build
```

To run tests, use:

```
pnpm test
```