import { ensureMappingMetaIsDefined } from './utils';

export function TransformOnFrom( action: (v: any) => any ) {
  return ( target: any, key: string ) => {

    ensureMappingMetaIsDefined( target );

    target._mappingMeta.transformsFrom[ key ] = action;
  };
}
