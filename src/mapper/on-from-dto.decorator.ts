import { ensureMappingMetaIsDefined } from './utils';

export function OnFromDto( action: (v: any) => any ) {
  return ( target: any, key: string ) => {

    ensureMappingMetaIsDefined( target );

    target._mappingMeta.onFromDtoTransforms[ key ] = action;
  };
}
