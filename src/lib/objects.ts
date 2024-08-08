export function isObject<T>(value: unknown): value is T {
  return typeof value === "object" && value !== null;
}
