import { ensureMappingMetaIsDefined } from './utils';

export function TransformOnToSource( action: (v: any) => any ) {
  return ( target: any, key: string ) => {

    ensureMappingMetaIsDefined( target );

    target._mappingMeta.transformsToSource[ key ] = action;
  };
}
