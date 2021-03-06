import { RequiredPropertyOptions } from '../../mapper/interfaces/required-property-options.interface';
import { MappingOptions } from '../../mapper/interfaces/mapping-options.interface';
import { RequiredProperty } from '../../mapper/required-property.decorator';
import { getMappingInfo } from '../../mapper/utils';
import { MappingMeta } from '../../mapper/interfaces/mapping-meta.interface';
import { DtoMappable } from '../../mapper/dto-mappable.decorator';
import { DtoMapper } from '../../mapper/dto-mapper';
import {
  ClassWithDefaultDecorator,
  ClassWithDefaultDecoratorAndOptionalNestedProperty,
  ClassWithDefaultDecoratorAndOptionalProperty,
  ClassWithDefaultDecoratorAndOptionalPropertyWithDefault,
  ClassWithDefaultDecoratorAndOptionalReadOnlyProperty,
  ClassWithDefaultDecoratorAndReadOnlyProperties,
  ClassWithDefaultDecoratorAndRequiredNestedProperty,
  ClassWithDefaultDecoratorAndRequiredProperty,
  ClassWithDefaultDecoratorOptionalPropertiesWithOnFromDto,
  ClassWithDefaultDecoratorOptionalPropertiesWithOnToDto,
  ClassWithDefaultDecoratorRequiredPropertiesWithOnFromDto,
  ClassWithDefaultDecoratorRequiredPropertiesWithOnToDto,
  ClassWithKeepOriginal,
  ClassWithKeepOriginalAndRequiredAndOptionalNestedProperties,
  ClassWithKeepOriginalAndRequiredAndOptionalProperties
} from '../mapper.test-classes';

const sourceWithNestedFibs = {
  uno: 'one',
  dos: 'two',
  nested: {
    fibs: [ 1, 1, 2, 3, 5, 8 ]
  },
  important: 'Life is important',
  alsoImportant: 'Water is important',
  smart: 'move',
  five: 5,
  seven: 7,
  numbers: [ 9, 33 ]
};

describe( 'Mapper', () => {

  it( 'should be defined', () => {
    expect( DtoMapper ).toBeDefined();
  } );


  describe( 'from', () => {

    it( 'should create an instance without parameters', () => {
      const mapping = DtoMappable();

      const mappedInstance = DtoMapper.fromDto( ClassWithDefaultDecorator, {} );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappedInstance ).toBeDefined();
      expect( mappingInfo.name ).toBe( 'ClassWithDefaultDecorator' );
      expect( mappedInstance.getFoo() ).toBe( 'DD' );
      expect( mappingInfo.original ).toBeUndefined();
    } );


    it( 'should create an instance and save source when keepOriginal is defined', () => {
      const source = {
        sourceFoo: 'source_foo'
      };

      const mappedInstance = DtoMapper.fromDto( ClassWithKeepOriginal, source );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappedInstance ).toBeDefined();
      expect( mappingInfo.name ).toBe( 'ClassWithKeepOriginal' );
      expect( mappingInfo.original ).toBe( source );
    } );

    describe( 'RequiredProperties', () => {

      it( 'should assign correct value from source', () => {
        const mappedInstance = DtoMapper.fromDto( ClassWithDefaultDecoratorAndRequiredProperty, sourceWithNestedFibs );

        expect( mappedInstance.requiredUno ).toEqual( sourceWithNestedFibs.uno );
      } );

      it( 'should assign correct value from source for nested property', () => {
        const mappedInstance
          = DtoMapper.fromDto( ClassWithDefaultDecoratorAndRequiredNestedProperty, sourceWithNestedFibs );

        expect( mappedInstance.fifthFib ).toEqual( sourceWithNestedFibs.nested.fibs[ 4 ] );
      } );

      it( 'should throw an error if required property is not defined', () => {
        expect(() => {
          DtoMapper.fromDto( ClassWithDefaultDecoratorAndRequiredNestedProperty, {} );
        } ).toThrow(
          // tslint:disable-next-line:max-line-length
          'Required property value "nested.fibs[4]"=>fifthFib was not found for ClassWithDefaultDecoratorAndRequiredNestedProperty'
          );
      } );

      it( 'should throw an error if client attempt to change read-only property', () => {
        const mappedInstance = DtoMapper.fromDto(
          ClassWithDefaultDecoratorAndReadOnlyProperties, sourceWithNestedFibs );

        expect( mappedInstance.doNotTouchThis ).toEqual( 'Life is important' );
        expect(() => {
          mappedInstance.doNotTouchThis = 'fuBar';
        } ).toThrow( 'Cannot assign a value to read-only property "doNotTouchThis"!' );
      } );

      it( 'should apply transformation function on from mapping', () => {
        const mappedInstance = DtoMapper.fromDto(
          ClassWithDefaultDecoratorRequiredPropertiesWithOnFromDto, sourceWithNestedFibs );

        expect( mappedInstance.ten ).toEqual( 10 );
        expect( mappedInstance.odds ).toEqual( [ 27, 99 ] );
      } );

    } );

    describe( 'OptionalProperties', () => {

      it( 'should assign correct value from source', () => {
        const mappedInstance = DtoMapper.fromDto( ClassWithDefaultDecoratorAndOptionalProperty, sourceWithNestedFibs );

        expect( mappedInstance.optionalDos ).toEqual( sourceWithNestedFibs.dos );
      } );

      it( 'should assign correct value from source for nested property', () => {
        const mappedInstance = DtoMapper.fromDto(
          ClassWithDefaultDecoratorAndOptionalNestedProperty, sourceWithNestedFibs );

        expect( mappedInstance.forthFib ).toEqual( sourceWithNestedFibs.nested.fibs[ 3 ] );
      } );

      it( 'should not throw an error if optional property is not defined', () => {
        const mappedInstance = DtoMapper.fromDto( ClassWithDefaultDecoratorAndOptionalNestedProperty, {} );

        expect( mappedInstance.forthFib ).toBeUndefined();
      } );

      it( 'should throw an error if client attempt to change read-only property', () => {
        const mappedInstance = DtoMapper.fromDto(
          ClassWithDefaultDecoratorAndOptionalReadOnlyProperty, sourceWithNestedFibs );

        expect( mappedInstance.doNotTouchThisTwo ).toEqual( 'Water is important' );
        expect(() => {
          mappedInstance.doNotTouchThisTwo = 'fuBar';
        } ).toThrow( 'Cannot assign a value to read-only property "doNotTouchThisTwo"!' );
      } );

      it( 'should use defaultValue is one is given for property that is not defined in source', () => {
        const mappedInstance = DtoMapper.fromDto( ClassWithDefaultDecoratorAndOptionalPropertyWithDefault, {} );

        expect( mappedInstance.aDefaultValue ).toBe( 33 );
      } );

      it( 'should apply transformation function on from mapping', () => {
        const mappedInstance = DtoMapper.fromDto(
          ClassWithDefaultDecoratorOptionalPropertiesWithOnFromDto, sourceWithNestedFibs );

        expect( mappedInstance.twentyOne ).toEqual( 21 );
        expect( mappedInstance.evens ).toEqual( [ 36, 132 ] );
      } );
    } );

  } );


  describe( 'toSource', () => {
    let mappedInstance;
    let mappingMeta;
    let source;

    beforeEach(( next ) => {

      source = {
        abc: 'xyz',
        list: [ 1, 2, 3 ],
        foo: 'popsicle',
        uno: 'one'
      };

      mappedInstance = DtoMapper.fromDto( ClassWithKeepOriginalAndRequiredAndOptionalProperties, source );
      mappingMeta = getMappingInfo( mappedInstance );

      next();
    } );

    it( 'should throw if given object without mapping meta', () => {
      expect(() => {
        DtoMapper.toDto( {} );
      } ).toThrow( 'Mapping metadata is missing for given object' );
    } );

    it( 'should have all unmapped source properties if keepOriginal is true', () => {
      const result = DtoMapper.toDto( mappedInstance );

      expect( result.abc ).toBe( source.abc );
      expect( result.list ).toBe( source.list );
      expect( result.foo ).toEqual( source.foo );
      expect( result.uno ).toEqual( mappedInstance.requiredUno );
    } );

    it( 'should include a null value for mapped property if excludeIfNull is false', () => {
      mappedInstance.requiredUno = null;
      mappedInstance.optionalDos = null;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfNull = false;
      mappingMeta.optionalProperties[ 'optionalDos' ].excludeIfNull = false;

      const result = DtoMapper.toDto( mappedInstance );

      expect( result.uno ).toBeNull();
      expect( result.dos ).toBeNull();
    } );

    it( 'should exclude a null value for mapped property if excludeIfNull is true', () => {
      mappedInstance.requiredUno = null;
      mappedInstance.optionalDos = null;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfNull = true;
      mappingMeta.optionalProperties[ 'optionalDos' ].excludeIfNull = true;

      const result = DtoMapper.toDto( mappedInstance );

      expect( result.uno ).toBeUndefined();
      expect( result.dos ).toBeUndefined();
    } );

    it( 'should include an undefined value for mapped property if excludeIfUndefined is false', () => {
      mappedInstance.requiredUno = undefined;
      mappedInstance.optionalDos = undefined;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfUndefined = false;
      mappingMeta.optionalProperties[ 'optionalDos' ].excludeIfUndefined = false;

      const result = DtoMapper.toDto( mappedInstance );

      expect( result.uno ).toBeUndefined();
      expect( result.hasOwnProperty( 'uno' ) ).toBe( true );
      expect( result.dos ).toBeUndefined();
      expect( result.hasOwnProperty( 'dos' ) ).toBe( true );
    } );

    it( 'should exclude an undefined value for mapped property if excludeIfUndefined is true', () => {
      mappedInstance.requiredUno = undefined;
      mappedInstance.optionalDos = undefined;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfUndefined = true;
      mappingMeta.optionalProperties[ 'optionalDos' ].excludeIfUndefined = true;

      const result = DtoMapper.toDto( mappedInstance );

      expect( result.hasOwnProperty( 'uno' ) ).toBe( false );
      expect( result.hasOwnProperty( 'dos' ) ).toBe( false );
    } );

    // tslint:disable-next-line:max-line-length
    it( 'should exclude an undefined value for mapped property if excludeIfUndefined is undefined and mappingOptions.excludeIfUndefined is true', () => {
      mappedInstance.requiredUno = undefined;
      mappedInstance.optionalDos = undefined;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfUndefined = undefined;
      mappingMeta.optionalProperties[ 'optionalDos' ].excludeIfUndefined = undefined;
      mappingMeta.options.excludeIfUndefined = true;

      const result = DtoMapper.toDto( mappedInstance );

      expect( result.hasOwnProperty( 'uno' ) ).toBe( false );
      expect( result.hasOwnProperty( 'dos' ) ).toBe( false );
    } );

    // tslint:disable-next-line:max-line-length
    it( 'should include an undefined value for mapped property if excludeIfUndefined is undefined and mappingOptions.excludeIfUndefined is false', () => {
      mappedInstance.requiredUno = undefined;
      mappedInstance.optionalDos = undefined;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfUndefined = undefined;
      mappingMeta.optionalProperties[ 'optionalDos' ].excludeIfUndefined = undefined;
      mappingMeta.options.excludeIfUndefined = false;

      const result = DtoMapper.toDto( mappedInstance );

      expect( result.hasOwnProperty( 'uno' ) ).toBe( true );
      expect( result.uno ).toBeUndefined();
      expect( result.hasOwnProperty( 'dos' ) ).toBe( true );
      expect( result.dos ).toBeUndefined();
    } );

    it( 'should update nested source properties', () => {
      mappedInstance = DtoMapper.fromDto(
        ClassWithKeepOriginalAndRequiredAndOptionalNestedProperties, sourceWithNestedFibs );

      mappedInstance.fifthFib = 42;
      mappedInstance.thirdFib = 44;
      const result = DtoMapper.toDto( mappedInstance );

      expect( result.nested.fibs[ 2 ] ).toEqual( 44 );
      expect( result.nested.fibs[ 4 ] ).toEqual( 42 );
    } );

    it( 'should include read-only value', () => {
      mappedInstance = DtoMapper.fromDto( ClassWithDefaultDecoratorAndReadOnlyProperties, sourceWithNestedFibs );

      const result = DtoMapper.toDto( mappedInstance );

      expect( result.important ).toEqual( 'Life is important' );
      expect( result.smart ).toEqual( 'move' );
    } );

    it( 'should apply transformation function on to source mapping', () => {
      mappedInstance = DtoMapper.fromDto(
        ClassWithDefaultDecoratorRequiredPropertiesWithOnToDto, sourceWithNestedFibs );
      const result = DtoMapper.toDto( mappedInstance );

      expect( result[ 'five' ] ).toEqual( 1 );
      expect( result[ 'numbers' ] ).toEqual( [ 3, 11 ] );
    } );

    it( 'should apply transformation function on to source mapping', () => {
      mappedInstance = DtoMapper.fromDto(
        ClassWithDefaultDecoratorOptionalPropertiesWithOnToDto, sourceWithNestedFibs );
      const result = DtoMapper.toDto( mappedInstance );

      expect( result[ 'seven' ] ).toEqual( 28 );
      expect( result[ 'numbers' ] ).toEqual( [ 54, 198 ] );
    } );

  } );

} );
