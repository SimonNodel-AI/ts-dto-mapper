import {
  Mapping
} from './mapping.decorator';
import {
  ajax
} from 'rxjs/observable/dom/ajax';
import {
  Mapper
} from './mapper';


const expectedDecoratorName = 'mapperTestDecoratedName';

function createDecoratedInstance( decorator, constructorToBeDecorated ) {
  const decoratedConstructor = decorator( constructorToBeDecorated );
  return new decoratedConstructor();
}


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

    it( 'should create an instance when given empty object', () => {
      const mapping = Mapping( expectedDecoratorName );

      const mappedInstance = Mapper.from<Foobar>( mapping( Foobar ), {});

      expect( mappedInstance ).toBeDefined();
      expect( mappedInstance[ '_mappingMeta' ].name ).toBe( expectedDecoratorName )
      expect( mappedInstance.getFoo() ).toBe( 'fu' );
      expect( mappedInstance.getBar() ).toBe( 'bar' );
      expect( mappedInstance[ '_mappingMeta' ].original ).toBeUndefined();
    });


    it( 'should create an instance and save source when keepOriginal is defined', () => {
      const mapping = Mapping( expectedDecoratorName, {
        keepOriginal: true
      });
      const source = {
        sourceFoo: 'source_foo'
      };

      const mappedInstance = Mapper.from<Foobar>( mapping( Foobar ), source );

      expect( mappedInstance ).toBeDefined();
      expect( mappedInstance[ '_mappingMeta' ].name ).toBe( expectedDecoratorName );
      expect( mappedInstance[ '_mappingMeta' ].original ).toBe( source );
    });

  });

});
