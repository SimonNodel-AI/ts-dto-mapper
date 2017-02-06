import { RequiredPropertyOptions } from '../interfaces/required-property-options.interface';
import { MappingOptions } from '../interfaces/mapping-options.interface';
import { setupTestingRouter } from '@angular/router/testing';
import { RequiredProperty } from '../required-property.decorator';
import { getMappingInfo } from '../utils';
import { MappingMeta } from '../interfaces/mapping-meta.interface';
import {
  Mapping
} from '../mapping.decorator';
import {
  ajax
} from 'rxjs/observable/dom/ajax';
import {
  Mapper
} from '../mapper';


class MapperTest {
  private foo: string;

  constructor( foo = 'fu' ) {
    this.foo = foo;
  }

  getFoo() {
    return this.foo;
  }
}

class ClassWithRequiredMappedFoo {
  @RequiredProperty( { path: 'foo' })
  fooValue;
}

class ClassWithNestedProperty {
  @RequiredProperty( { path: 'nested.fibs[4]' })
  fifthFib;
}


@Mapping()
class RequiredTest {
  @RequiredProperty( { path: 'uno' })
  requiredUno;

  @RequiredProperty( { path: 'nested.fibs[4]' })
  fifthFib;
}

const keepOriginalMapping = Mapping( {
  keepOriginal: true
});

const noOriginalMapping = Mapping( {
  keepOriginal: false
});

const sourceWithNestedFibs = {
  uno: 'one',
  nested: {
    fibs: [ 1, 1, 2, 3, 5, 8 ]
  }
};

function generateRequiredTestMappedInstance(
  mappingOptions: MappingOptions, requiredOptions: RequiredPropertyOptions, source: any ) {

  @Mapping( mappingOptions )
  class Test {
    @RequiredProperty( requiredOptions )
    requiredValue;
  }
  return Mapper.from<Test>( Test, source );
}

describe( 'Mapper', () => {

  it( 'should be defined', () => {
    expect( Mapper ).toBeDefined();
  });


  describe( 'from', () => {

    it( 'should create an instance without parameters', () => {
      const mapping = Mapping();

      const mappedInstance = Mapper.from<MapperTest>( mapping( MapperTest ), {});
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappedInstance ).toBeDefined();
      expect( mappingInfo.name ).toBe( MapperTest.name );
      expect( mappedInstance.getFoo() ).toBe( 'fu' );
      expect( mappingInfo.original ).toBeUndefined();
    });


    it( 'should create an instance and save source when keepOriginal is defined', () => {
      const source = {
        sourceFoo: 'source_foo'
      };

      const mappedInstance = Mapper.from<MapperTest>( keepOriginalMapping( MapperTest ), source );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappedInstance ).toBeDefined();
      expect( mappingInfo.name ).toBe( MapperTest.name );
      expect( mappingInfo.original ).toBe( source );
    });

    describe( 'RequiredProperties', () => {

      it( 'should assign correct value from source', () => {
        const mappedInstance = Mapper.from<RequiredTest>( RequiredTest, sourceWithNestedFibs );

        expect( mappedInstance.requiredUno ).toEqual( sourceWithNestedFibs.uno );
        expect( mappedInstance.fifthFib ).toEqual( sourceWithNestedFibs.nested.fibs[ 4 ] );
      });

    });

  });


  describe( 'toSource', () => {
    let mappedInstance;
    let source;

    beforeEach(( next ) => {

      source = {
        abc: 'xyz',
        list: [ 1, 2, 3 ],
        foo: 'popsicle'
      };

      mappedInstance = Mapper.from<ClassWithRequiredMappedFoo>(
        noOriginalMapping( ClassWithRequiredMappedFoo ),
        source );

      next();
    });

    it( 'should throw if given object without mapping meta', () => {
      expect(() => {
        Mapper.toSource( {});
      }).toThrow( Error( 'Mapping metadata is missing for given object' ) );
    });

    it( 'should have all unmapped source properties if keepOriginal is true', () => {
      mappedInstance = Mapper.from<ClassWithRequiredMappedFoo>(
        keepOriginalMapping( ClassWithRequiredMappedFoo ),
        source );
      const result = Mapper.toSource( mappedInstance );

      expect( result.abc ).toBe( source.abc );
      expect( result.list ).toBe( source.list );
      expect( result.foo ).toEqual( mappedInstance.fooValue );
    });

    it( 'should include a null value for mapped property if excludeIfNull is false', () => {
      mappedInstance.fooValue = null;
      const mappingMeta = getMappingInfo( mappedInstance );
      mappingMeta.requiredProperties[ 'fooValue' ].excludeIfNull = false;
      const result = Mapper.toSource( mappedInstance );

      expect( result.foo ).toBeNull();
    });

    it( 'should exclude a null value for mapped property if excludeIfNull is true', () => {
      mappedInstance.fooValue = null;
      const mappingMeta = getMappingInfo( mappedInstance );
      mappingMeta.requiredProperties[ 'fooValue' ].excludeIfNull = true;

      const result = Mapper.toSource( mappedInstance );

      expect( result.foo ).toBeUndefined();
    });

    it( 'should include an undefined value for mapped property if excludeIfUndefined is false', () => {
      mappedInstance.fooValue = undefined;
      const mappingMeta = getMappingInfo( mappedInstance );
      mappingMeta.requiredProperties[ 'fooValue' ].excludeIfUndefined = false;
      const result = Mapper.toSource( mappedInstance );

      expect( result.foo ).toBeUndefined();
      expect( result.hasOwnProperty( 'foo' ) ).toBe( true );
    });

    it( 'should exclude an undefined value for mapped property if excludeIfUndefined is true', () => {
      mappedInstance.fooValue = undefined;
      const mappingMeta = getMappingInfo( mappedInstance );
      mappingMeta.requiredProperties[ 'fooValue' ].excludeIfUndefined = true;

      const result = Mapper.toSource( mappedInstance );

      expect( result.hasOwnProperty( 'foo' ) ).toBe( false );
    });

    it( 'should exclude an undefined value for mapped property if mappingOptions.excludeIfUndefined is true', () => {
      mappedInstance.fooValue = undefined;
      const mappingMeta = getMappingInfo( mappedInstance );
      mappingMeta.options.excludeIfUndefined = true;

      const result = Mapper.toSource( mappedInstance );


      expect( result.hasOwnProperty( 'foo' ) ).toBe( false );
    });

    it( 'should include an undefined value for mapped property if mappingOptions.excludeIfUndefined is false', () => {
      const mapped = generateRequiredTestMappedInstance( { excludeIfUndefined: false }, { path: 'foo' },
        { foo: 'bar' });

      mapped.requiredValue = undefined;
      const result = Mapper.toSource( mapped );

      expect( result.hasOwnProperty( 'foo' ) ).toBe( true );
      expect( result.foo ).toBeUndefined();
    });

    it( 'should update nested source properties', () => {
      mappedInstance = Mapper.from<ClassWithNestedProperty>(
        keepOriginalMapping( ClassWithNestedProperty ),
        sourceWithNestedFibs );

      mappedInstance.fifthFib = 42;
      const result = Mapper.toSource( mappedInstance );

      expect( result.nested.fibs[ 4 ] ).toEqual( 42 );
    });

  });

});
