
/**
 * Required property decorator interface
 *
 * @export
 * @interface RequiredPropertyOptions
 */
export interface RequiredPropertyOptions {


  /**
   * Path of where to extract value in source object during mapping operation.
   *
   * Will throw if given empty string!
   *
   * @type {string}
   * @memberOf RequiredPropertyOptions
   */
  path: string;

  /**
   * If set to true null value will not be included when mapping back to source object type.
   *
   * Default value is false!
   *
   * @type {boolean}
   * @memberOf MappingOptions
   */
  excludeIfNull?: boolean;

  /**
   * If set to true undefined value will not be included when mapping back to source object type.
   *
   * Default value is false!
   *
   * @type {boolean}
   * @memberOf MappingOptions
   */
  excludeIfUndefined?: boolean;
}
