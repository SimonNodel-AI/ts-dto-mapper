
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
   * If not defined then MappingOptions.excludeIfNull will be used
   *
   * @type {boolean}
   * @memberOf RequiredPropertyOptions
   */
  excludeIfNull?: boolean;

  /**
   * If set to true undefined value will not be included when mapping back to source object type.
   *
   * If not defined then MappingOptions.excludeIfUndefined will be used
   *
   * @type {boolean}
   * @memberOf RequiredPropertyOptions
   */
  excludeIfUndefined?: boolean;


  /**
   * If set to true the property, the property will be read-only.  (Defaults to false)
   *
   * @type {boolean}
   * @memberOf RequiredPropertyOptions
   */
  readOnly?: boolean;
}
