import { RequiredPropertyOptions } from './required-property-options.interface';


/**
 * Optional property decorator interface
 *
 * @export
 * @interface OptionalPropertyOptions
 * @extends {RequiredPropertyOptions}
 */
export interface OptionalPropertyOptions extends RequiredPropertyOptions {

  /**
   * Default value to use when source object does not have a corresponding property
   *
   * @type {*}
   * @memberOf OptionalPropertyOptions
   */
  defaultValue?: any;

}

