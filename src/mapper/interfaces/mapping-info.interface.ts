import { OptionalPropertyOptions } from './optional-property-options.interface';
import { RequiredPropertyOptions } from './required-property-options.interface';
import { MappingOptions } from './mapping-options.interface';


/**
 * Mapping metadata information
 *
 * @export
 * @interface MappingInfo
 */
export interface MappingInfo {

  /**
   * Name of the class being decorated
   *
   * @type {string}
   * @memberOf MappingInfo
   */
  name: string;


  /**
   * Mapping metadata options
   *
   * @type {MappingOptions}
   * @memberOf MappingInfo
   */
  options: MappingOptions;



  /**
   * Original source object that was mapped.  It is set if keepOriginal property is set to true information
   * MappingOptions
   *
   * @type {*}
   * @memberOf MappingInfo
   */
  original?: any;



  /**
   * Hash of property names to RequiredProperty definitions
   *
   * @type {{[ name: string ]: RequiredPropertyOptions }}
   * @memberOf MappingInfo
   */
  requiredProperties?: { [ name: string ]: RequiredPropertyOptions };


  /**
   * Value storage for mapped properties.
   *
   * @type {{ [name: string ]: any }}
   * @memberOf MappingInfo
   */
  values?: { [name: string ]: any };


  /**
   * Hash of property names to OptionalProperty definitions
   *
   * @type {{[ name: string ]: OptionalPropertyOptions }}
   * @memberOf MappingInfo
   */
  optionalProperties?: { [ name: string ]: OptionalPropertyOptions };

  /**
   * Functor storage for transforming from source property value during mapping
   *
   * @type {{ [name: string ]: TransformOnFrom }}
   * @memberOf MappingInfo
   */
  transformsFrom?: { [name: string ]: (v: any) => any };

  /**
   * Functor storage for transforming to source property value during mapping
   *
   * @type {{ [name: string ]: TransformOnFrom }}
   * @memberOf MappingInfo
   */
  transformsToSource?: { [name: string ]: (v: any) => any };
}
