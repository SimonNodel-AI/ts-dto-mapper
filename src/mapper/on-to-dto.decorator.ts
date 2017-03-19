import { ensureMappingMetaIsDefined } from './utils';

export function OnToDto( action: (v: any) => any ) {
  return ( target: any, key: string ) => {

    ensureMappingMetaIsDefined( target );

    target._mappingMeta.onToDtoTransforms[ key ] = action;
  };
}
