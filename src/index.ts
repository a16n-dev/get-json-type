type JsonType =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonType[]
  | { [key: string]: JsonType };

type getJsonTypeOpts = {
  throwOnUnknown?: boolean;
  indentSize?: number;
  multiline?: boolean;
  typeName?: string;
  useLiteralTypes?: boolean;
};

function _getJsonType(
  json: JsonType,
  opts: getJsonTypeOpts,
  depth = 0
): string {
  if (json === null) return 'null';
  if (json === undefined) return 'undefined';

  if (Array.isArray(json)) {
    if (json.length === 0) return 'any[]';

    const elementTypes = json.map((item) => _getJsonType(item, opts, depth));
    const uniqueTypes = [...new Set(elementTypes)];

    if (uniqueTypes.length === 1) {
      return `${uniqueTypes[0]}[]`;
    }

    return `(${uniqueTypes.join(' | ')})[]`;
  }

  if (typeof json === 'object') {
    const indentSize = opts.indentSize ?? 2;
    const multiline = opts.multiline ?? false;

    if (multiline) {
      const currentIndent = ' '.repeat(depth * indentSize);
      const nextIndent = ' '.repeat((depth + 1) * indentSize);

      const properties = Object.entries(json)
        .map(
          ([key, value]) =>
            `${nextIndent}${key}: ${_getJsonType(value, opts, depth + 1)};`
        )
        .join('\n');

      return `{\n${properties}\n${currentIndent}}`;
    } else {
      const properties = Object.entries(json)
        .map(
          ([key, value]) => `${key}: ${_getJsonType(value, opts, depth + 1)}`
        )
        .join('; ');

      return `{ ${properties} }`;
    }
  }

  if (opts.useLiteralTypes) {
    if (typeof json === 'string') return `"${json.replace(/"/g, '\\"')}"`;
    if (typeof json === 'number') return `${json}`;
    if (typeof json === 'boolean') return `${json}`;
  }

  if (typeof json === 'string') return 'string';
  if (typeof json === 'number') return 'number';
  if (typeof json === 'boolean') return 'boolean';

  if (opts.throwOnUnknown) {
    throw new Error(`Unknown JSON type: ${typeof json}`);
  }

  return 'any';
}

export function getJsonType(json: any, opts: getJsonTypeOpts = {}): string {
  const typeString = _getJsonType(json, opts, 0);

  if (opts.typeName) {
    return `type ${opts.typeName} = ${typeString}`;
  }

  return typeString;
}
