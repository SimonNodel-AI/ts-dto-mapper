import { MappingMeta } from './interfaces/mapping-meta.interface';
import {
  MappingOptions
} from './interfaces/mapping-options.interface';
import { MappingInfo } from './interfaces/mapping-info.interface';

const DEFAULT_OPTIONS: MappingOptions = {
  keepOriginal: false,
  excludeIfNull: false,
  excludeIfUndefined: false
};

/**
 * Mapping definition decorator.
 *
 * Usage:
 * @Mapping({keepOriginal: true})
 * class Foo {
 * ...
 * }
 *
 * @export
 * @param {MappingOptions} [mappingOptions] - options for how to handle whole object being mapped
 * @returns {MappingMeta}
 */
export function Mapping( mappingOptions: MappingOptions = {}) {

  return ( target: Function ) => {
    const original: Function = target;

    function makeDecoratedInstance( constructor: any, args: any[] ): MappingMeta {
      const NewInstance: any = function () {
        return constructor.apply( this, args );
      };
      NewInstance.prototype = constructor.prototype;
      const instance = new NewInstance();

      instance._mappingMeta = <MappingInfo>{
        name: constructor.name,
        options: resolveMappingOptionsWithDefaults( mappingOptions )
      };

      return instance;
    }

    const decoratedConstructor: any = ( ...args: any[] ) => {
      return makeDecoratedInstance( original, args );
    };
    decoratedConstructor.prototype = original.prototype;

    return decoratedConstructor;
  };
}

function resolveMappingOptionsWithDefaults( mappingOptions: MappingOptions ): MappingOptions {

  // Destructure (with default values assigned)
  const {
    keepOriginal = DEFAULT_OPTIONS.keepOriginal,
    excludeIfNull = DEFAULT_OPTIONS.excludeIfNull,
    excludeIfUndefined = DEFAULT_OPTIONS.excludeIfUndefined
  } = mappingOptions;

  // Restructure
  mappingOptions = {
    keepOriginal,
    excludeIfNull,
    excludeIfUndefined
  };

  return mappingOptions;
}
