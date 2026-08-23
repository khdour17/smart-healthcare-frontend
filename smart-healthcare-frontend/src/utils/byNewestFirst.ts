export function byNewestFirst<T>(dateOf: (item: T) => string) {
  return (a: T, b: T) => dateOf(b).localeCompare(dateOf(a));
}
