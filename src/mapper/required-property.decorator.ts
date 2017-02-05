import { ensureMappingMetaIsDefined } from './utils';
import { MappingInfo } from './interfaces/mapping-info.interface';
import { RequiredPropertyOptions } from './interfaces/required-property-options.interface';

const DEFAULT_OPTIONS: RequiredPropertyOptions = {
  path: '',
  excludeIfNull: false,
  excludeIfUndefined: false
};


/**
 * Mapping property decorator for required properties.
 *
 * Usage:
 * @Mapping()
 * class Foo {
 * ...
 *   @RequiredProperty({path:'abc.xyz'})
 *   abc;
 * }
 *
 * @export
 * @param {RequiredPropertyOptions} options
 * @returns
 */
export function RequiredProperty( options: RequiredPropertyOptions ) {
  return ( target: any, key: string ) => {

    ensureMappingMetaIsDefined( target );
    target._mappingMeta.requiredProperties[ key ] = resolveOptionsWithDefaults( options );

    let value = this[ key ];

    const getter = function getter() {
      return value;
    };

    const setter = function setter( newValue ) {
      value = newValue;
    };

    if ( delete this[ key ] ) {
      Object.defineProperty( target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
      });
    }
  };
}

function resolveOptionsWithDefaults( options: RequiredPropertyOptions ): RequiredPropertyOptions {

  if ( !options.path || options.path.length === 0 ) {
    throw new Error( 'RequiredProperty mapping decorator requires path to be defined' );
  }

  // Destructure (with default values assigned)
  const {
    path = DEFAULT_OPTIONS.path,
    excludeIfNull = DEFAULT_OPTIONS.excludeIfNull,
    excludeIfUndefined = DEFAULT_OPTIONS.excludeIfUndefined
  } = options;

  // Restructure
  options = {
    path,
    excludeIfNull,
    excludeIfUndefined
  };

  return options;
}
