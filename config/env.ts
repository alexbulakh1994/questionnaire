export function traverseObjectWithSync<
  C extends (
    key: string,
    value: any,
    metadata?: { path: string; context: Record<string, any> },
  ) => any,
>(obj: Record<string, any>, callback: C) {
  const traverseRecursive = (o: Record<string, any>, cb: C, path = []) => {
    const pathStr = path.join('.');
    for (const [k, v] of Object.entries(o)) {
      const propertyPathStr = pathStr.length ? `${pathStr}.${k}` : k;

      cb(k, v, { path: propertyPathStr, context: o });

      if (v && typeof v === 'object') {
        traverseRecursive(v, cb, [...path, k]);
      }
    }
  };

  traverseRecursive(obj, callback);
}

export function env(content: string, defaults: Record<string, any> = {}) {
  const R = /\${([A-Z0-9_]+(:[^}]+)?)}/gi;

  let cast = true;
  let occurrences = 0;

  const result = content.replace(R, (_, entry) => {
    occurrences += 1;
    if (occurrences > 1) {
      cast = false;
    }

    // eslint-disable-next-line prefer-const
    let [name, fallback, ...rest] = entry.split(':');

    // Env (always string or undefined)
    if (process.env[name]) {
      return process.env[name];
    }

    // Fallback
    if (fallback) {
      if (rest && rest.length) {
        fallback = [fallback, ...rest].join(':');
      }
      fallback = fallback.trim();
      if (fallback.startsWith('"')) {
        cast = false;
        fallback = fallback.replace(/^"([^"]+)"$/g, '$1');
      } else if (fallback.startsWith("'")) {
        cast = false;
        fallback = fallback.replace(/^'([^']+)'$/g, '$1');
      }
      return fallback;
    }

    // Defaults
    if (typeof defaults[name] !== 'undefined') {
      if (typeof defaults[name] !== 'string' && occurrences === 1) {
        cast = true;
      }
      return defaults[name];
    }

    throw new Error(`Env variable '${name}' is not set`);
  });

  if (!cast || !occurrences) {
    return result;
  }

  const resultTrimmed = result.trimEnd();
  // is null
  if (resultTrimmed === 'null') {
    return null;
  }
  // is boolean
  if (resultTrimmed === 'true' || resultTrimmed === 'false') {
    return resultTrimmed === 'true';
  }
  // is number
  if (!Number.isNaN(Number(resultTrimmed)) && !resultTrimmed.startsWith(' ')) {
    return Number(resultTrimmed);
  }

  // return the un-trimmed string if not able to cast
  return result;
}

const expandedObjects: Record<string, any>[] = [];

export function expandEnv(object: Record<string, any>) {
  // Dumb way to prevent double interpolation
  if (expandedObjects.includes(object)) {
    return object;
  }
  expandedObjects.push(object);

  return traverseObjectWithSync(object, (k, v, { context }) => {
    if (typeof v === 'string') {
      context[k] = env(v);
    }
  });
}
