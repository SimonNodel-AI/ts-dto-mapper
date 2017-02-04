import { MappingOptions } from './mapping-options.interface';

export interface MappingInfo {
  name: string;
  options: MappingOptions;
  original?: any;
}
