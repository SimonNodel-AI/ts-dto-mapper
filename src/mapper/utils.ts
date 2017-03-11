import { MappingInfo } from './interfaces/mapping-info.interface';

const MAPPING_META = '_mappingMeta';

export function getMappingInfo( source ): MappingInfo {
  return source[ MAPPING_META ];
}

export function ensureMappingMetaIsDefined(target: any) {
   if ( !target._mappingMeta ) {
      Object.defineProperty( target, MAPPING_META, {
        value: <MappingInfo>{
          requiredProperties: {},
          values: {},
          optionalProperties: {},
          transformsFrom: {},
          transformsToSource: {}
        },
        enumerable: false,
        configurable: false
      });
    }
};
