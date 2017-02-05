
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


  /**
   * If set to true all mapped properties that are null (and don't have their own excludeIfNull property)
   * will not be included when mapping back to source object type.
   *
   * Note that each mapped property definition can override this setting for itself.
   *
   * Default value is false!
   *
   * @type {boolean}
   * @memberOf MappingOptions
   */
  excludeIfNull?: boolean;

  /**
   * If set to true all mapped properties that are undefined (and don't have their own excludeIfUndefined property)
   * will not be included when mapping back to source object type.
   *
   * Note that each mapped property definition can override this setting for itself.
   *
   * Default value is false!
   *
   * @type {boolean}
   * @memberOf MappingOptions
   */
  excludeIfUndefined?: boolean;
}
