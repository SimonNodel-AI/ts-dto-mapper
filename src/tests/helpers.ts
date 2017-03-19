import { getMappingInfo } from '../mapper/utils';
import { MappingInfo } from '../mapper/interfaces/mapping-info.interface';
import { MappingMeta } from '../mapper/interfaces/mapping-meta.interface';

export function createDecoratedInstance( decorator, constructorToBeDecorated ): MappingMeta {
  const decoratedConstructor = decorator( constructorToBeDecorated );
  return new decoratedConstructor();
};

export function getRequiredProperties( source ) {
  return getMappingInfo( source ).requiredProperties;
}

export function getOptionalProperties( source ) {
  return getMappingInfo( source ).optionalProperties;
}

export function getTransformsFrom( source ) {
  return getMappingInfo( source ).transformsFrom;
}

export function getTransformsToSource( source ) {
  return getMappingInfo( source ).transformsToSource;
}
