import {
  Mapping
} from './mapping.decorator';
import {
  MappingOptions
} from './mapping-options.interface';

const expectedDecoratorName = 'testDecoratedName';

function createDecoratedInstance( decorator, constructorToBeDecorated ) {
  const decoratedConstructor = decorator( constructorToBeDecorated );
  return new decoratedConstructor();
}

describe( 'Mapping', () => {

  it( 'should return a decorator function', () => {
    const decorator = Mapping( 'testName', {
      keepOriginal: true
    } );

    expect( decorator ).toBeDefined();
  } );

  describe( 'decorator', () => {
    const testFunction = function() {};

    it( 'should add _mappingMeta property with default options when no options are provided', () => {
      const decorator = Mapping( expectedDecoratorName );

      const result = createDecoratedInstance( decorator, testFunction );

      expect( result._mappingMeta ).toBeDefined();
      expect( result._mappingMeta.name ).toBe( expectedDecoratorName );
      expect( result._mappingMeta.options ).toBeDefined();
      expect( result._mappingMeta.options.keepOriginal ).toBe( false );
    } );

    it( 'should add _mappingMeta property with given mapping option values', () => {
      const decorator = Mapping( expectedDecoratorName, {
        keepOriginal: true
      } );

      const result = createDecoratedInstance( decorator, testFunction );

      expect( result._mappingMeta ).toBeDefined();
      expect( result._mappingMeta.name ).toBe( expectedDecoratorName );
      expect( result._mappingMeta.options ).toBeDefined();
      expect( result._mappingMeta.options.keepOriginal ).toBe( true );
    } );

  } );
} );
