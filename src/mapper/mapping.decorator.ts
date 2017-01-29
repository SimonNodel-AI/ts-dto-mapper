import { MappingOptions } from './mapping-options.interface';


/**
 * Mapping definition decorator.
 *
 * Usage:
 * @Mapping('Foo', {keepOriginal: true})
 * class Foo {
 * ...
 * }
 *
 * @export
 * @param {string} name - name of the object mapping
 * @param {MappingOptions} mappingOptions - options for how to handle whole object being mapped
 * @returns
 */
export function Mapping(name: string, mappingOptions: MappingOptions) {

  return function (target: Function) {
    const original: Function = target;

    function makeDecoratedInstance(constructor: any, args: any[]) {
      const NewInstance: any = function () {
        return constructor.apply(this, args);
      };
      NewInstance.prototype = constructor.prototype;
      const instance = new NewInstance();

      instance._mappingMeta = {
        name,
        mappingOptions
      };

      return instance;
    }

    const decoratedConstructor: any = function (...args: any[]) {
      return makeDecoratedInstance(original, args);
    };
    decoratedConstructor.prototype = original.prototype;

    return decoratedConstructor;
  };
}
