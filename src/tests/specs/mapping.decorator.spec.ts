import { getMappingInfo } from '../../mapper/utils';
import { createDecoratedInstance } from '../helpers';
import {
  DtoMappable
} from '../../mapper/dto-mappable.decorator';
import {
  MappingOptions
} from '../../mapper/interfaces/mapping-options.interface';
import {
  MappingMeta
} from '../../mapper/interfaces/mapping-meta.interface';


describe( 'Mapping', () => {

  it( 'should return a decorator function', () => {
    const decorator = DtoMappable( {
      keepOriginal: true
    });

    expect( decorator ).toBeDefined();
  });

  describe( 'decorator', () => {
    const testFunction = function () { };

    it( 'should add mapping info with default options when no options are provided', () => {
      const decorator = DtoMappable();

      const mappedInstance = createDecoratedInstance( decorator, testFunction );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappingInfo ).toBeDefined();
      expect( mappingInfo.name ).toBe( testFunction['name'] );
      expect( mappingInfo.options ).toBeDefined();
      expect( mappingInfo.options.keepOriginal ).toBe( false );
      expect( mappingInfo.options.excludeIfNull ).toBe( false );
      expect( mappingInfo.options.excludeIfUndefined ).toBe( false );
    });

    it( 'should add mapping info with keepOriginal parameter', () => {
      const decorator = DtoMappable( {
        keepOriginal: true
      });

      const mappedInstance = createDecoratedInstance( decorator, testFunction );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappingInfo ).toBeDefined();
      expect( mappingInfo.options.keepOriginal ).toBe( true );
    });

    it( 'should add mapping info with excludeIfNull parameter', () => {
      const decorator = DtoMappable( {
        excludeIfNull: true
      });

      const mappedInstance = createDecoratedInstance( decorator, testFunction );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappingInfo ).toBeDefined();
      expect( mappingInfo.options.excludeIfNull ).toBe( true );
    });

    it( 'should add mapping info with excludeIfUndefined parameter', () => {
      const decorator = DtoMappable( {
        excludeIfUndefined: true
      });

      const mappedInstance = createDecoratedInstance( decorator, testFunction );
      const mappingInfo = getMappingInfo( mappedInstance );

      expect( mappingInfo ).toBeDefined();
      expect( mappingInfo.options.excludeIfUndefined ).toBe( true );
    });

  });
});
