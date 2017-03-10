import { OptionalPropertyOptions } from './interfaces/optional-property-options.interface';
import { ensureMappingMetaIsDefined } from './utils';
import { MappingInfo } from './interfaces/mapping-info.interface';

const DEFAULT_OPTIONS: OptionalPropertyOptions = {
  path: '',
  excludeIfNull: undefined,
  excludeIfUndefined: undefined,
  readOnly: false,
  defaultValue: undefined
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
 * @param {OptionalPropertyOptions} options
 * @returns
 */
export function OptionalProperty( options: OptionalPropertyOptions ) {
  return ( target: any, key: string ) => {

    ensureMappingMetaIsDefined( target );
    target._mappingMeta.optionalProperties[ key ] = resolveOptionsWithDefaults( options );
    target._mappingMeta.values[ key ] = this[ key ];

    const getter = function getter() {
      return target._mappingMeta.values[ key ];
    };

    const setter = function setter( newValue ) {
      if ( options.readOnly ) {
        throw new Error( `Cannot assign a value to read-only property "${key}"!` );
      }
      target._mappingMeta.values[ key ] = newValue;
    };

    if ( delete this[ key ] ) {
      Object.defineProperty( target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
      } );
    }
  };
}

function resolveOptionsWithDefaults( options: OptionalPropertyOptions ): OptionalPropertyOptions {

  if ( !options.path || options.path.length === 0 ) {
    throw new Error( 'OptionalProperty mapping decorator requires path to be defined' );
  }

  // Destructure (with default values assigned)
  const {
    path = DEFAULT_OPTIONS.path,
    excludeIfNull = DEFAULT_OPTIONS.excludeIfNull,
    excludeIfUndefined = DEFAULT_OPTIONS.excludeIfUndefined,
    readOnly = DEFAULT_OPTIONS.readOnly,
    defaultValue = DEFAULT_OPTIONS.defaultValue
  } = options;

  // Restructure
  options = {
    path,
    excludeIfNull,
    excludeIfUndefined,
    readOnly,
    defaultValue
  };

  return options;
}
