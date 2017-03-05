import { RequiredPropertyOptions } from '../interfaces/required-property-options.interface';
import { MappingOptions } from '../interfaces/mapping-options.interface';
import { setupTestingRouter } from '@angular/router/testing';
import { RequiredProperty } from '../required-property.decorator';
import { getMappingInfo } from '../utils';
import { MappingMeta } from '../interfaces/mapping-meta.interface';
import { Mapping } from '../mapping.decorator';
import { Mapper } from '../mapper';
import {
  ClassWithDefaultDecorator,
  ClassWithDefaultDecoratorAndOptionalNestedProperty,
  ClassWithDefaultDecoratorAndOptionalProperty,
  ClassWithDefaultDecoratorAndOptionalPropertyWithDefault,
  ClassWithDefaultDecoratorAndOptionalReadOnlyProperty,
  ClassWithDefaultDecoratorAndRequiredNestedProperty,
  ClassWithDefaultDecoratorAndRequiredProperty,
  ClassWithDefaultDecoratorAndReadOnlyProperties,
  ClassWithKeepOriginal,
  ClassWithKeepOriginalAndRequiredAndOptionalNestedProperties,
  ClassWithKeepOriginalAndRequiredAndOptionalProperties
} from './mapper.test-classes';

const sourceWithNestedFibs = {
  uno: 'one',
  dos: 'two',
  nested: {
    fibs: [ 1, 1, 2, 3, 5, 8 ]
  },
  important: 'Life is important',
  alsoImportant: 'Water is important',
  smart: 'move'
};

describe( 'Mapper', () => {

  it( 'should be defined', () => {
    expect( Mapper ).toBeDefined();
  } );


  describe( 'from', () => {

    it( 'should create an instance without parameters', () => {
      const mapping = Mapping();

      const mappedInstance = Mapper.from( ClassWithDefaultDecorator, {} );
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

      const mappedInstance = Mapper.from( ClassWithKeepOriginal, source );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappedInstance ).toBeDefined();
      expect( mappingInfo.name ).toBe( 'ClassWithKeepOriginal' );
      expect( mappingInfo.original ).toBe( source );
    } );

    describe( 'RequiredProperties', () => {

      it( 'should assign correct value from source', () => {
        const mappedInstance = Mapper.from( ClassWithDefaultDecoratorAndRequiredProperty, sourceWithNestedFibs );

        expect( mappedInstance.requiredUno ).toEqual( sourceWithNestedFibs.uno );
      } );

      it( 'should assign correct value from source for nested property', () => {
        const mappedInstance = Mapper.from( ClassWithDefaultDecoratorAndRequiredNestedProperty, sourceWithNestedFibs );

        expect( mappedInstance.fifthFib ).toEqual( sourceWithNestedFibs.nested.fibs[ 4 ] );
      } );

      it( 'should throw an error if required property is not defined', () => {
        expect(() => {
          Mapper.from( ClassWithDefaultDecoratorAndRequiredNestedProperty, {} );
        } ).toThrow(
          // tslint:disable-next-line:max-line-length
          Error( 'Required property value "nested.fibs[4]"=>fifthFib was not found for ClassWithDefaultDecoratorAndRequiredNestedProperty' )
          );
      } );

      it( 'should throw an error if client attempt to change read-only property', () => {
        const mappedInstance = Mapper.from(
          ClassWithDefaultDecoratorAndReadOnlyProperties, sourceWithNestedFibs );

        expect( mappedInstance.doNotTouchThis ).toEqual( 'Life is important' );
        expect(() => {
          mappedInstance.doNotTouchThis = 'fuBar';
        } ).toThrow(
          Error( 'Cannot assign a value to read-only property "doNotTouchThis"!' )
          );
      } );

    } );

    describe( 'OptionalProperties', () => {

      it( 'should assign correct value from source', () => {
        const mappedInstance = Mapper.from( ClassWithDefaultDecoratorAndOptionalProperty, sourceWithNestedFibs );

        expect( mappedInstance.optionalDos ).toEqual( sourceWithNestedFibs.dos );
      } );

      it( 'should assign correct value from source for nested property', () => {
        const mappedInstance = Mapper.from( ClassWithDefaultDecoratorAndOptionalNestedProperty, sourceWithNestedFibs );

        expect( mappedInstance.forthFib ).toEqual( sourceWithNestedFibs.nested.fibs[ 3 ] );
      } );

      it( 'should not throw an error if optional property is not defined', () => {
        const mappedInstance = Mapper.from( ClassWithDefaultDecoratorAndOptionalNestedProperty, {} );

        expect( mappedInstance.forthFib ).toBeUndefined();
      } );

      it( 'should throw an error if client attempt to change read-only property', () => {
        const mappedInstance = Mapper.from(
          ClassWithDefaultDecoratorAndOptionalReadOnlyProperty, sourceWithNestedFibs );

        expect( mappedInstance.doNotTouchThisTwo ).toEqual( 'Water is important' );
        expect(() => {
          mappedInstance.doNotTouchThisTwo = 'fuBar';
        } ).toThrow(
          Error( 'Cannot assign a value to read-only property "doNotTouchThisTwo"!' )
          );
      } );

      it( 'should use defaultValue is one is given for property that is not defined in source', () => {
        const mappedInstance = Mapper.from( ClassWithDefaultDecoratorAndOptionalPropertyWithDefault, {} );

        expect( mappedInstance.aDefaultValue ).toBe( 33 );
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

      mappedInstance = Mapper.from( ClassWithKeepOriginalAndRequiredAndOptionalProperties, source );
      mappingMeta = getMappingInfo( mappedInstance );

      next();
    } );

    it( 'should throw if given object without mapping meta', () => {
      expect(() => {
        Mapper.toSource( {} );
      } ).toThrow( Error( 'Mapping metadata is missing for given object' ) );
    } );

    it( 'should have all unmapped source properties if keepOriginal is true', () => {
      const result = Mapper.toSource( mappedInstance );

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

      const result = Mapper.toSource( mappedInstance );

      expect( result.uno ).toBeNull();
      expect( result.dos ).toBeNull();
    } );

    it( 'should exclude a null value for mapped property if excludeIfNull is true', () => {
      mappedInstance.requiredUno = null;
      mappedInstance.optionalDos = null;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfNull = true;
      mappingMeta.optionalProperties[ 'optionalDos' ].excludeIfNull = true;

      const result = Mapper.toSource( mappedInstance );

      expect( result.uno ).toBeUndefined();
      expect( result.dos ).toBeUndefined();
    } );

    it( 'should include an undefined value for mapped property if excludeIfUndefined is false', () => {
      mappedInstance.requiredUno = undefined;
      mappedInstance.optionalDos = undefined;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfUndefined = false;
      mappingMeta.optionalProperties[ 'optionalDos' ].excludeIfUndefined = false;

      const result = Mapper.toSource( mappedInstance );

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

      const result = Mapper.toSource( mappedInstance );

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

      const result = Mapper.toSource( mappedInstance );

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

      const result = Mapper.toSource( mappedInstance );

      expect( result.hasOwnProperty( 'uno' ) ).toBe( true );
      expect( result.uno ).toBeUndefined();
      expect( result.hasOwnProperty( 'dos' ) ).toBe( true );
      expect( result.dos ).toBeUndefined();
    } );

    it( 'should update nested source properties', () => {
      mappedInstance = Mapper.from( ClassWithKeepOriginalAndRequiredAndOptionalNestedProperties, sourceWithNestedFibs );

      mappedInstance.fifthFib = 42;
      mappedInstance.thirdFib = 44;
      const result = Mapper.toSource( mappedInstance );

      expect( result.nested.fibs[ 2 ] ).toEqual( 44 );
      expect( result.nested.fibs[ 4 ] ).toEqual( 42 );
    } );

    it( 'should include read-only value', () => {
      mappedInstance = Mapper.from( ClassWithDefaultDecoratorAndReadOnlyProperties, sourceWithNestedFibs );

      const result = Mapper.toSource( mappedInstance );

      expect( result.important ).toEqual( 'Life is important' );
      expect( result.smart ).toEqual( 'move' );
    } );

  } );

} );
