import { createDecoratedInstance, getMappingInfo } from './helpers';
import {
  Mapping
} from '../mapping.decorator';
import {
  MappingOptions
} from '../interfaces/mapping-options.interface';
import {
  MappingMeta
} from '../interfaces/mapping-meta.interface';


describe( 'Mapping', () => {

  it( 'should return a decorator function', () => {
    const decorator = Mapping( {
      keepOriginal: true
    });

    expect( decorator ).toBeDefined();
  });

  describe( 'decorator', () => {
    const testFunction = function () { };

    it( 'should add mapping info with default options when no options are provided', () => {
      const decorator = Mapping();

      const mappedInstance = createDecoratedInstance( decorator, testFunction );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappingInfo ).toBeDefined();
      expect( mappingInfo.name ).toBe( testFunction.name );
      expect( mappingInfo.options ).toBeDefined();
      expect( mappingInfo.options.keepOriginal ).toBe( false );
      expect( mappingInfo.options.excludeIfNull ).toBe( false );
      expect( mappingInfo.options.excludeIfUndefined ).toBe( false );
    });

    it( 'should add mapping info with keepOriginal parameter', () => {
      const decorator = Mapping( {
        keepOriginal: true
      });

      const mappedInstance = createDecoratedInstance( decorator, testFunction );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappingInfo ).toBeDefined();
      expect( mappingInfo.options.keepOriginal ).toBe( true );
    });

    it( 'should add mapping info with excludeIfNull parameter', () => {
      const decorator = Mapping( {
        excludeIfNull: true
      });

      const mappedInstance = createDecoratedInstance( decorator, testFunction );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappingInfo ).toBeDefined();
      expect( mappingInfo.options.excludeIfNull ).toBe( true );
    });

    it( 'should add mapping info with excludeIfUndefined parameter', () => {
      const decorator = Mapping( {
        excludeIfUndefined: true
      });

      const mappedInstance = createDecoratedInstance( decorator, testFunction );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappingInfo ).toBeDefined();
      expect( mappingInfo.options.excludeIfUndefined ).toBe( true );
    });

  });
});
