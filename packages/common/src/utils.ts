const DEFAULT_DATE_FIELDS = ['createdAt', 'updatedAt'] as const;

type DateFieldNames = typeof DEFAULT_DATE_FIELDS[number];

type WithParsedDates<T, K extends string> = T extends (infer U)[]
  ? WithParsedDates<U, K>[]
  : T extends object
  ? {
      [P in keyof T]: P extends K
        ? T[P] extends string
          ? Date
          : T[P]
        : T[P] extends object
        ? WithParsedDates<T[P], K>
        : T[P];
    }
  : T;

export const withParsedDates = <
  T extends Record<string, any> | Record<string, any>[] | null | undefined,
  K extends string = DateFieldNames
>(
  data: T,
  extraFields: K[] = []
): WithParsedDates<T, DateFieldNames | K> => {
  if (data === null || data === undefined || typeof data !== 'object') {
    return data as WithParsedDates<T, DateFieldNames | K>;
  }

  if (Array.isArray(data)) {
    return data.map(item => withParsedDates(item, extraFields)) as WithParsedDates<T, DateFieldNames | K>;
  }

  const result = { ...data } as Record<string, any>;
  const dateFields = [...DEFAULT_DATE_FIELDS, ...extraFields];

  for (const [key, value] of Object.entries(result)) {
    if (value && typeof value === 'string' && dateFields.includes(key as any)) {
      result[key] = new Date(value);
    } else if (value && typeof value === 'object') {
      result[key] = withParsedDates(value, extraFields);
    }
  }

  return result as WithParsedDates<T, DateFieldNames | K>;
};
