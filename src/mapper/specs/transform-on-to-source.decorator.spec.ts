import { TransformOnToSource } from '../transform-on-to-source.decorator';
import { getTransformsToSource } from './helpers';
import { Mapping } from '../mapping.decorator';
import { OptionalProperty } from '../optional-property.decorator';
import { RequiredProperty } from '../required-property.decorator';

const addThree = v => v + 3;

@Mapping()
class TransformOnToSourceTest {
  @RequiredProperty( { path: 'pi' })
  @TransformOnToSource( addThree )
  piPlusThree;
}

describe( 'TransformOnToSource', () => {

  it( 'should return a decorator function', () => {
    const decorator = TransformOnToSource( () => {} );

    expect( decorator ).toBeDefined();
  });

  describe( 'decorator', () => {

    it( 'should add transformation functor', () => {
      const instance = new TransformOnToSourceTest();
      const transforms = getTransformsToSource( instance );

      expect( transforms ).toBeDefined();
      expect( transforms[ 'piPlusThree' ] ).toBeDefined();
      expect( transforms[ 'piPlusThree' ] ).toBe(addThree);
    });
  });

});
