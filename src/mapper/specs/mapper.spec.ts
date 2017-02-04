import { getMappingInfo } from './helpers';
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


class Foobar {
  private foo: string;
  private bar: string;

  constructor( foo = 'fu', bar = 'bar' ) {
    this.foo = foo;
    this.bar = bar;
  }

  getFoo() {
    return this.foo;
  }

  getBar() {
    return this.bar;
  }
}

describe( 'Mapper', () => {

  it( 'should be defined', () => {
    expect( Mapper ).toBeDefined();
  });


  describe( 'from', () => {

    it( 'should create an instance without parameters', () => {
      const mapping = Mapping();

      const mappedInstance = Mapper.from<Foobar>( mapping( Foobar ), {});
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappedInstance ).toBeDefined();
      expect( mappingInfo.name ).toBe( Foobar.name )
      expect( mappedInstance.getFoo() ).toBe( 'fu' );
      expect( mappedInstance.getBar() ).toBe( 'bar' );
      expect( mappingInfo.original ).toBeUndefined();
    });


    it( 'should create an instance and save source when keepOriginal is defined', () => {
      const mapping = Mapping( {
        keepOriginal: true
      });

      const source = {
        sourceFoo: 'source_foo'
      };

      const mappedInstance = Mapper.from<Foobar>( mapping( Foobar ), source );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappedInstance ).toBeDefined();
      expect( mappingInfo.name ).toBe( Foobar.name );
      expect( mappingInfo.original ).toBe( source );
    });

  });

});
