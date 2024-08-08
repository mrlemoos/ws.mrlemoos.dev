export function suppressPrefix<
  T extends string,
  P extends string,
  E = T extends `${P}${infer U}` ? U : T
>(value: T, prefix: P): E {
  if (!value) {
    return "" as E;
  }

  const strWithoutPrefix = value.replace(prefix, "").trim();
  return strWithoutPrefix as E;
}
