
/**
 * Mapping options for class mapping definition
 *
 * @export
 * @interface MappingOptions
 */
export interface MappingOptions {


  /**
   * If set a reference to original source object being mapped from is saved with the mapped instance.
   * This is handy if you need to get at original data (to support undo or json patch).
   *
   * Default value is false!
   *
   * @type {boolean}
   * @memberOf MappingOptions
   */
  keepOriginal?: boolean;
}
