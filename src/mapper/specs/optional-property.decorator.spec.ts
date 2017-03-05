import { getOptionalProperties } from './helpers';
import { OptionalProperty } from '../optional-property.decorator';

class OptionalPropertyTest {
  @OptionalProperty( { path: 'boom' } )
  pathOnly;

  @OptionalProperty( { path: 'excludeNull', excludeIfNull: true } )
  excludeNull;

  @OptionalProperty( { path: 'excludeUndefined', excludeIfUndefined: true } )
  excludeUndefined;

  @OptionalProperty( { path: 'important', readOnly: true } )
  important;

  @OptionalProperty( { path: 'noValue', defaultValue: 100 } )
  oneHundred;
}

class WillThrow {
  shouldThrow;
}


describe( 'OptionalProperty', () => {

  it( 'should return a decorator function', () => {
    const decorator = OptionalProperty( {
      path: 'foo'
    } );

    expect( decorator ).toBeDefined();
  } );

  it( 'should throw if path is empty', () => {
    expect(() => {
      const decorator = OptionalProperty( { path: '' } );
      decorator( WillThrow, 'shouldThrow' );
    } ).toThrow( Error( 'OptionalProperty mapping decorator requires path to be defined' ) );
  } );

  describe( 'decorator', () => {

    it( 'should add mapping info with default options when only path is provided', () => {
      const instance = new OptionalPropertyTest();
      const properties = getOptionalProperties( instance );

      expect( properties ).toBeDefined();
      expect( properties[ 'pathOnly' ].path ).toBe( 'boom' );
      expect( properties[ 'pathOnly' ].excludeIfNull ).toBeUndefined();
      expect( properties[ 'pathOnly' ].excludeIfUndefined ).toBeUndefined();
      expect( properties[ 'pathOnly' ].readOnly ).toBe( false );
    } );

    it( 'should add mapping info with excludeIfNull', () => {
      const instance = new OptionalPropertyTest();
      const properties = getOptionalProperties( instance );

      expect( properties ).toBeDefined();
      expect( properties[ 'excludeNull' ].path ).toBe( 'excludeNull' );
      expect( properties[ 'excludeNull' ].excludeIfNull ).toBe( true );
      expect( properties[ 'excludeNull' ].readOnly ).toBe( false );
    } );

    it( 'should add mapping info with excludeIfUndefined', () => {
      const instance = new OptionalPropertyTest();
      const properties = getOptionalProperties( instance );

      expect( properties ).toBeDefined();
      expect( properties[ 'excludeUndefined' ].path ).toBe( 'excludeUndefined' );
      expect( properties[ 'excludeUndefined' ].excludeIfUndefined ).toBe( true );
      expect( properties[ 'excludeUndefined' ].readOnly ).toBe( false );
    } );

    it( 'should add mapping info with readOnly', () => {
      const instance = new OptionalPropertyTest();
      const properties = getOptionalProperties( instance );

      expect( properties ).toBeDefined();
      expect( properties[ 'important' ].path ).toBe( 'important' );
      expect( properties[ 'important' ].readOnly ).toBe( true );
    } );

    it( 'should add mapping info with defaultValue', () => {
      const instance = new OptionalPropertyTest();
      const properties = getOptionalProperties( instance );

      expect( properties ).toBeDefined();
      expect( properties[ 'oneHundred' ].path ).toBe( 'noValue' );
      expect( properties[ 'oneHundred' ].defaultValue ).toBe( 100 );
    } );

  } );

} );
