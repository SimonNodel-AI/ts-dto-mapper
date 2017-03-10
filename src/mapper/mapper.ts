import { MappingMeta } from './interfaces/mapping-meta.interface';
import { RequiredPropertyOptions } from './interfaces/required-property-options.interface';
import { MappingInfo } from './interfaces/mapping-info.interface';
import { getMappingInfo } from './utils';
import { each, get, set, unset, isUndefined, isNull } from 'lodash';


export class Mapper {

  static from<T>( mappingDefinition: { new ( ...params ): T; }, source: any = {}, ...params ): T {
    const instance = new mappingDefinition( ...params );
    const meta = getMappingInfo( instance );

    saveSourceIfKeepOriginalDefined( source, meta );
    assignRequiredValuesFromSource( instance, source, meta );
    assignOptionalValuesFromSource( instance, source, meta );

    return <T>instance;
  }

  static toSource( mappedInstance: any ) {
    const meta = getMappingInfo( mappedInstance );
    if ( isUndefined( meta ) ) {
      throw new Error( 'Mapping metadata is missing for given object' );
    }
    const result = meta.options.keepOriginal ? meta.original : {};

    assignRequiredPropertiesToResult( mappedInstance, result, meta );
    assignOptionalPropertiesToResult( mappedInstance, result, meta );

    return result;
  }
}


function saveSourceIfKeepOriginalDefined( source: any, meta: MappingInfo ) {
  if ( meta.options.keepOriginal ) {
    meta.original = source;
  }
}

function assignRequiredValuesFromSource( instance: any, source: any, meta: MappingInfo ) {
  if ( isUndefined( meta.requiredProperties ) ) {
    return;
  }


  each( meta.requiredProperties, ( property, name ) => {
    const value = get( source, property.path, undefined );
    if ( isUndefined( value ) ) {
      throw new Error( `Required property value "${property.path}"=>${name} was not found for ${meta.name}` );
    }
    meta.values[ name ] = applyTransformFrom( name, meta, value );
  });
}

function applyTransformFrom( name: string, meta: MappingInfo, value: any ): any {
  const transform = meta.transformsFrom[ name ] || (v => v);
  return transform( value );
}


function assignOptionalValuesFromSource( instance: any, source: any, meta: MappingInfo ) {
  if ( isUndefined( meta.optionalProperties ) ) {
    return;
  }

  each( meta.optionalProperties, ( property, name ) => {
    const value = get( source, property.path, property.defaultValue );
    meta.values[ name ] = value;
  });
}

function assignRequiredPropertiesToResult( instance: any, result: any, meta: MappingInfo ) {
  if ( isUndefined( meta.requiredProperties ) ) {
    return;
  }

  each( meta.requiredProperties, ( property, propertyName ) => {
    const value = instance[ propertyName ];
    if ( isUndefined( value ) && shouldBeExcluded( property.excludeIfUndefined, meta.options.excludeIfUndefined ) ) {
      unset( result, property.path );
      return true;
    } else if ( isNull( value ) && shouldBeExcluded( property.excludeIfNull, meta.options.excludeIfNull ) ) {
      unset( result, property.path );
      return true;
    }
    set( result, property.path, value );
  } );
}

function shouldBeExcluded( propertyExclusionValue, metaOptionsExclusionFlag ) {
  if ( propertyExclusionValue === true ) {
    return true;
  }
  return ( isUndefined( propertyExclusionValue ) ) ? metaOptionsExclusionFlag : false;
}

function assignOptionalPropertiesToResult( instance: any, result: any, meta: MappingInfo ) {
  if ( isUndefined( meta.optionalProperties ) ) {
    return;
  }

  each( meta.optionalProperties, ( property, propertyName ) => {
    const value = instance[ propertyName ];
    if ( isUndefined( value ) && shouldBeExcluded( property.excludeIfUndefined, meta.options.excludeIfUndefined ) ) {
      unset( result, property.path );
      return true;
    } else if ( isNull( value ) && shouldBeExcluded( property.excludeIfNull, meta.options.excludeIfNull ) ) {
      unset( result, property.path );
      return true;
    }
    set( result, property.path, value );
  } );
}
