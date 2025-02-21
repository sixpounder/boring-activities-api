export function alternate<T, U>(
  source: Iterable<T>,
  interject: (previousElement: T) => U,
) {
  let out: (T | U)[] = [];
  for (const element of source) {
    out = [...out, element, interject(element)];
  }

  return out;
}
