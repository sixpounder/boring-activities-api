/* eslint-disable @typescript-eslint/no-explicit-any */
import { forEach, isFunction, set } from "lodash-es";

type AnyCtor<T> = new (...args: any[]) => T;
type AnyFunction<T> = (...args: any[]) => T;

/**
 * Create a new instance of `Klass` by injecting values in its
 * constructor. Also binds its methods to itself so that it is
 * safe to use as a middleware.
 * @param Klass the type to instantiate
 * @param injects the values to inject on the constructor
 * @returns
 */
export function inject<T extends object>(
  Klass: AnyCtor<T>,
  ...injects: any[]
): T {
  const instance = new Klass(...injects);
  const fns = Object.getOwnPropertyNames(Klass.prototype)
    .filter((name) => isFunction(instance[name]) && name !== "constructor");
  forEach(fns, (name) => {
    const fn: AnyFunction<any> = instance[name];
    set(instance, name, fn.bind(instance));
  });
  return instance;
}
