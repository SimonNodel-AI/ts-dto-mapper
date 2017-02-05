import { RequiredPropertyOptions } from './interfaces/required-property-options.interface';
import { MappingInfo } from './interfaces/mapping-info.interface';
import { getMappingInfo } from './utils';
import { each, get, isUndefined } from 'lodash';


export class Mapper {

  static from<T>( mappingDefinition: {new(...params): T; }, source: any = {}, ...params ): T {
    const instance = new mappingDefinition( ...params );
    const meta = getMappingInfo( instance );

    Mapper.saveSourceIfKeepOriginalDefined( source, meta );
    Mapper.assignRequiredValues( instance, source, meta );

    return <T>instance;
  }


  private static saveSourceIfKeepOriginalDefined( source: any, meta: MappingInfo ) {
    if ( meta.options.keepOriginal ) {
      meta.original = source;
    }
  }

  private static assignRequiredValues( instance: any, source: any, meta: MappingInfo ) {
    if ( !meta.requiredProperties ) {
      return;
    }


    each( meta.requiredProperties, ( property, name ) => {
      const value = get( source, property.path, undefined );
      if ( isUndefined( value ) ) {
        throw new Error( `Required mapping ${name} property was not found for ${meta.name}` );
      }
      instance[name] = value;
    });
  }

}

