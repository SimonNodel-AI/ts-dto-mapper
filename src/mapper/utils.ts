import { MappingInfo } from './interfaces/mapping-info.interface';

export function getMappingInfo( source ): MappingInfo {
  return source[ '_mappingMeta' ];
}

export function ensureMappingMetaIsDefined(target: any) {
   if ( !target._mappingMeta ) {
      Object.defineProperty( target, '_mappingMeta', {
        value: <MappingInfo>{
          requiredProperties: {},
          requiredPropertyValues: {}
        },
        enumerable: false,
        configurable: false
      });
    }
};
