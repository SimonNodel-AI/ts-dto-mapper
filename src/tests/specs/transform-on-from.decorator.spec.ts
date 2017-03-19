import { getTransformsFrom } from '../helpers';
import { TransformOnFrom } from '../../mapper/transform-on-from.decorator';
import { DtoMappable } from '../../mapper/dto-mappable.decorator';
import { OptionalProperty } from '../../mapper/optional-property.decorator';
import { RequiredProperty } from '../../mapper/required-property.decorator';

const doubler = v => v * 2;

@DtoMappable()
class TransformOnFromTest {
  @RequiredProperty( { path: 'pi' })
  @TransformOnFrom( doubler )
  twoPi;
}

describe( 'TransformOnFrom', () => {

  it( 'should return a decorator function', () => {
    const decorator = TransformOnFrom( () => {} );

    expect( decorator ).toBeDefined();
  });

  describe( 'decorator', () => {

    it( 'should add transformation functor', () => {
      const instance = new TransformOnFromTest();
      const transforms = getTransformsFrom( instance );

      expect( transforms ).toBeDefined();
      expect( transforms[ 'twoPi' ] ).toBeDefined();
      expect( transforms[ 'twoPi' ] ).toBe(doubler);
    });
  });

});
