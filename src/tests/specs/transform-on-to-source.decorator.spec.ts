import { TransformOnToSource } from '../../mapper/transform-on-to-source.decorator';
import { getTransformsToSource } from '../helpers';
import { DtoMappable } from '../../mapper/dto-mappable.decorator';
import { OptionalProperty } from '../../mapper/optional-property.decorator';
import { RequiredProperty } from '../../mapper/required-property.decorator';

const addThree = v => v + 3;

@DtoMappable()
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
