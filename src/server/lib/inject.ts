import { forEach, isFunction, isObject, set } from "lodash-es";

type AnyCtor<T, A> = new (...args: A[]) => T;
type AnyFunction<T, A> = (...args: A[]) => T;

/**
 * Create a new instance of `Klass` by injecting `injects` values in its
 * constructor. If `new Klass` yields an object then this
 * also binds its methods to itself, so that it is
 * safe to use as a middleware.
 * @param Klass the type to instantiate
 * @param injects the values to inject on the constructor
 * @returns
 */
export function inject<T, A>(
  Klass: AnyCtor<T, A>,
  ...injects: A[]
): T {
  const instance = new Klass(...injects);
  if (isObject(instance)) {
    const fns = Object.getOwnPropertyNames(Klass.prototype)
      .filter((name) => isFunction(instance[name]) && name !== "constructor");
    forEach(fns, (name) => {
      const fn: AnyFunction<T, A> = instance[name];
      set(instance, name, fn.bind(instance));
    });
  }
  return instance;
}
