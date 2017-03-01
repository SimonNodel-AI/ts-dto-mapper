import { RequiredPropertyOptions } from '../interfaces/required-property-options.interface';
import { MappingOptions } from '../interfaces/mapping-options.interface';
import { setupTestingRouter } from '@angular/router/testing';
import { RequiredProperty } from '../required-property.decorator';
import { getMappingInfo } from '../utils';
import { MappingMeta } from '../interfaces/mapping-meta.interface';
import { Mapping } from '../mapping.decorator';
import { Mapper} from '../mapper';
import {
  ClassWithDefaultDecorator,
  ClassWithKeepOriginal,
  ClassWithDefaultDecoratorAndRequiredProperty,
  ClassWithDefaultDecoratorAndRequiredNestedProperty,
  ClassWithKeepOriginalAndRequiredProperty,
  ClassWithKeepOriginalAndRequiredNestedProperty
} from './mapper.test-classes';

const sourceWithNestedFibs = {
  uno: 'one',
  nested: {
    fibs: [ 1, 1, 2, 3, 5, 8 ]
  }
};

describe( 'Mapper', () => {

  it( 'should be defined', () => {
    expect( Mapper ).toBeDefined();
  });


  describe( 'from', () => {

    it( 'should create an instance without parameters', () => {
      const mapping = Mapping();

      const mappedInstance = Mapper.from<ClassWithDefaultDecorator>( ClassWithDefaultDecorator, {});
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappedInstance ).toBeDefined();
      expect( mappingInfo.name ).toBe( 'ClassWithDefaultDecorator' );
      expect( mappedInstance.getFoo() ).toBe( 'DD' );
      expect( mappingInfo.original ).toBeUndefined();
    });


    it( 'should create an instance and save source when keepOriginal is defined', () => {
      const source = {
        sourceFoo: 'source_foo'
      };

      const mappedInstance = Mapper.from<ClassWithKeepOriginal>( ClassWithKeepOriginal, source );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappedInstance ).toBeDefined();
      expect( mappingInfo.name ).toBe( 'ClassWithKeepOriginal' );
      expect( mappingInfo.original ).toBe( source );
    });

    describe( 'RequiredProperties', () => {

      it( 'should assign correct value from source', () => {
        const mappedInstance = Mapper.from<ClassWithDefaultDecoratorAndRequiredProperty>(
          ClassWithDefaultDecoratorAndRequiredProperty, sourceWithNestedFibs );

        expect( mappedInstance.requiredUno ).toEqual( sourceWithNestedFibs.uno );
      });

       it( 'should assign correct value from source for nested property', () => {
        const mappedInstance = Mapper.from<ClassWithDefaultDecoratorAndRequiredNestedProperty>(
          ClassWithDefaultDecoratorAndRequiredNestedProperty, sourceWithNestedFibs );

        expect( mappedInstance.fifthFib ).toEqual( sourceWithNestedFibs.nested.fibs[ 4 ] );
      });

      it( 'should throw an error if required property is not defined', () => {
        expect( () => {
          Mapper.from<ClassWithDefaultDecoratorAndRequiredNestedProperty>(
            ClassWithDefaultDecoratorAndRequiredNestedProperty, {} );
        }).toThrow(
          // tslint:disable-next-line:max-line-length
          Error('Required property value "nested.fibs[4]"=>fifthFib was not found for ClassWithDefaultDecoratorAndRequiredNestedProperty' )
        );
      });

    });

  });


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

      mappedInstance = Mapper.from<ClassWithKeepOriginalAndRequiredProperty>(
        ClassWithKeepOriginalAndRequiredProperty,
        source );

      mappingMeta = getMappingInfo( mappedInstance );

      next();
    });

    it( 'should throw if given object without mapping meta', () => {
      expect(() => {
        Mapper.toSource( {} );
      }).toThrow( Error( 'Mapping metadata is missing for given object' ) );
    });

    it( 'should have all unmapped source properties if keepOriginal is true', () => {
      const result = Mapper.toSource( mappedInstance );

      expect( result.abc ).toBe( source.abc );
      expect( result.list ).toBe( source.list );
      expect( result.foo ).toEqual( source.foo );
      expect( result.uno ).toEqual( mappedInstance.requiredUno );
    });

    it( 'should include a null value for mapped property if excludeIfNull is false', () => {
      mappedInstance.requiredUno = null;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfNull = false;

      const result = Mapper.toSource( mappedInstance );

      expect( result.uno ).toBeNull();
    });

    it( 'should exclude a null value for mapped property if excludeIfNull is true', () => {
      mappedInstance.requiredUno = null;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfNull = true;

      const result = Mapper.toSource( mappedInstance );

      expect( result.uno ).toBeUndefined();
    });

    it( 'should include an undefined value for mapped property if excludeIfUndefined is false', () => {
      mappedInstance.requiredUno = undefined;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfUndefined = false;

      const result = Mapper.toSource( mappedInstance );

      expect( result.uno ).toBeUndefined();
      expect( result.hasOwnProperty( 'uno' ) ).toBe( true );
    });

    it( 'should exclude an undefined value for mapped property if excludeIfUndefined is true', () => {
      mappedInstance.requiredUno = undefined;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfUndefined = true;

      const result = Mapper.toSource( mappedInstance );

      expect( result.hasOwnProperty( 'uno' ) ).toBe( false );
    });

    // tslint:disable-next-line:max-line-length
    it( 'should exclude an undefined value for mapped property if excludeIfUndefined is undefined and mappingOptions.excludeIfUndefined is true', () => {
      mappedInstance.requiredUno = undefined;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfUndefined = undefined;
      mappingMeta.options.excludeIfUndefined = true;

      const result = Mapper.toSource( mappedInstance );


      expect( result.hasOwnProperty( 'uno' ) ).toBe( false );
    });

    // tslint:disable-next-line:max-line-length
    it( 'should include an undefined value for mapped property if excludeIfUndefined is undefined and mappingOptions.excludeIfUndefined is false', () => {
      mappedInstance.requiredUno = undefined;
      mappingMeta.requiredProperties[ 'requiredUno' ].excludeIfUndefined = undefined;
      mappingMeta.options.excludeIfUndefined = false;

      const result = Mapper.toSource( mappedInstance );

      expect( result.hasOwnProperty( 'uno' ) ).toBe( true );
      expect( result.uno ).toBeUndefined();
    });

    it( 'should update nested source properties', () => {
      mappedInstance = Mapper.from<ClassWithKeepOriginalAndRequiredNestedProperty>(
        ClassWithKeepOriginalAndRequiredNestedProperty,
        sourceWithNestedFibs );

      mappedInstance.fifthFib = 42;
      const result = Mapper.toSource( mappedInstance );

      expect( result.nested.fibs[ 4 ] ).toEqual( 42 );
    });

  });

});
