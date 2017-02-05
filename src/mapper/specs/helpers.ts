import { getMappingInfo } from '../utils';
import { MappingInfo } from '../interfaces/mapping-info.interface';
import { MappingMeta } from '../interfaces/mapping-meta.interface';

export function createDecoratedInstance( decorator, constructorToBeDecorated ): MappingMeta {
  const decoratedConstructor = decorator( constructorToBeDecorated );
  return new decoratedConstructor();
};

export function getRequiredProperties( source ) {
  return getMappingInfo( source ).requiredProperties;
}
