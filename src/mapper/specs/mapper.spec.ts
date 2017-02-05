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

@Mapping()
class RequiredTest {
  @RequiredProperty( { path: 'uno' })
  requiredUno;

  @RequiredProperty( {path: 'nested.fibs[4]'})
  fifthFib;
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
      const mapping = Mapping( {
        keepOriginal: true
      });

      const source = {
        sourceFoo: 'source_foo'
      };

      const mappedInstance = Mapper.from<MapperTest>( mapping( MapperTest ), source );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappedInstance ).toBeDefined();
      expect( mappingInfo.name ).toBe( MapperTest.name );
      expect( mappingInfo.original ).toBe( source );
    });

    describe( 'RequiredProperties', () => {
      const source = {
        uno: 'one',
        nested: {
          fibs: [1, 1, 2, 3, 5, 8]
        }
      };

      it( 'should assign correct value from source', () => {
        const mappedInstance = Mapper.from<RequiredTest>( RequiredTest, source );

        expect( mappedInstance.requiredUno ).toEqual( source.uno );
        expect( mappedInstance.fifthFib ).toEqual( source.nested.fibs[4] );
      });

    });

  });

});
