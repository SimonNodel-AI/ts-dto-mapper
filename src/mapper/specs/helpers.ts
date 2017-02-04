import { MappingInfo } from '../interfaces/mapping-info.interface';
import { MappingMeta } from '../interfaces/mapping-meta.interface';

export function createDecoratedInstance( decorator, constructorToBeDecorated ): MappingMeta {
  const decoratedConstructor = decorator( constructorToBeDecorated );
  return new decoratedConstructor();
};

export function getMappingInfo( source ): MappingInfo {
  return source[ '_mappingMeta' ];
}
