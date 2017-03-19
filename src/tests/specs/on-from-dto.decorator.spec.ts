import { getFromDtoTransforms } from '../helpers';
import { OnFromDto } from '../../mapper/on-from-dto.decorator';
import { DtoMappable } from '../../mapper/dto-mappable.decorator';
import { OptionalProperty } from '../../mapper/optional-property.decorator';
import { RequiredProperty } from '../../mapper/required-property.decorator';

const doubler = v => v * 2;

@DtoMappable()
class TransformOnFromTest {
  @RequiredProperty( { path: 'pi' })
  @OnFromDto( doubler )
  twoPi;
}

describe( 'TransformOnFrom', () => {

  it( 'should return a decorator function', () => {
    const decorator = OnFromDto( () => {} );

    expect( decorator ).toBeDefined();
  });

  describe( 'decorator', () => {

    it( 'should add transformation functor', () => {
      const instance = new TransformOnFromTest();
      const transforms = getFromDtoTransforms( instance );

      expect( transforms ).toBeDefined();
      expect( transforms[ 'twoPi' ] ).toBeDefined();
      expect( transforms[ 'twoPi' ] ).toBe(doubler);
    });
  });

});
