import { getRequiredProperties } from './helpers';
import { RequiredProperty } from '../required-property.decorator';

class RequiredPropertyTest {
  @RequiredProperty( { path: 'boom' })
  pathOnly;

  @RequiredProperty( { path: 'excludeNull', excludeIfNull: true })
  excludeNull;

  @RequiredProperty( { path: 'excludeUndefined', excludeIfUndefined: true })
  excludeUndefined;

  @RequiredProperty( { path: 'important', readOnly: true })
  important;
}

class WillThrow {
  shouldThrow;
}


describe( 'RequiredProperty', () => {

  it( 'should return a decorator function', () => {
    const decorator = RequiredProperty( {
      path: 'foo'
    });

    expect( decorator ).toBeDefined();
  });

  it( 'should throw if path is empty', () => {
    expect(() => {
      const decorator = RequiredProperty( { path: '' });
      decorator( WillThrow, 'shouldThrow' );
    }).toThrow( Error( 'RequiredProperty mapping decorator requires path to be defined' ) );
  });

  describe( 'decorator', () => {

    it( 'should add mapping info with default options when only path is provided', () => {
      const instance = new RequiredPropertyTest();
      const requiredProperties = getRequiredProperties( instance );

      expect( requiredProperties ).toBeDefined();
      expect( requiredProperties[ 'pathOnly' ].path ).toBe( 'boom' );
      expect( requiredProperties[ 'pathOnly' ].excludeIfNull ).toBeUndefined();
      expect( requiredProperties[ 'pathOnly' ].excludeIfUndefined ).toBeUndefined();
      expect( requiredProperties[ 'pathOnly' ].readOnly ).toBe(false);
    });

    it( 'should add mapping info with excludeIfNull', () => {
      const instance = new RequiredPropertyTest();
      const requiredProperties = getRequiredProperties( instance );

      expect( requiredProperties ).toBeDefined();
      expect( requiredProperties[ 'excludeNull' ].path ).toBe( 'excludeNull' );
      expect( requiredProperties[ 'excludeNull' ].excludeIfNull ).toBe( true );
      expect( requiredProperties[ 'excludeNull' ].readOnly ).toBe(false);
    });

    it( 'should add mapping info with excludeIfUndefined', () => {
      const instance = new RequiredPropertyTest();
      const requiredProperties = getRequiredProperties( instance );

      expect( requiredProperties ).toBeDefined();
      expect( requiredProperties[ 'excludeUndefined' ].path ).toBe( 'excludeUndefined' );
      expect( requiredProperties[ 'excludeUndefined' ].excludeIfUndefined ).toBe( true );
      expect( requiredProperties[ 'excludeUndefined' ].readOnly ).toBe(false);
    });

    it( 'should add mapping info with readOnly', () => {
      const instance = new RequiredPropertyTest();
      const requiredProperties = getRequiredProperties( instance );

      expect( requiredProperties ).toBeDefined();
      expect( requiredProperties[ 'important' ].path ).toBe( 'important' );
      expect( requiredProperties[ 'important' ].readOnly ).toBe(true);
    });

  });

});
