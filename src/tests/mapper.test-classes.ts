import { OnToDto } from '../mapper/on-to-dto.decorator';
import { OnFromDto } from '../mapper/on-from-dto.decorator';
import { OptionalProperty } from '../mapper/optional-property.decorator';
import { RequiredProperty } from '../mapper/required-property.decorator';
import { DtoMappable } from '../mapper/dto-mappable.decorator';

@DtoMappable()
export class ClassWithDefaultDecorator {
  private foo: string;

  constructor( foo = 'DD' ) {
    this.foo = foo;
  }

  getFoo() {
    return this.foo;
  }
}


@DtoMappable()
export class ClassWithDefaultDecoratorAndRequiredProperty {
  @RequiredProperty( { path: 'uno' } )
  requiredUno;
}

@DtoMappable()
export class ClassWithDefaultDecoratorAndOptionalProperty {
  @OptionalProperty( { path: 'dos' } )
  optionalDos;
}

@DtoMappable()
export class ClassWithDefaultDecoratorAndRequiredNestedProperty {
  @RequiredProperty( { path: 'nested.fibs[4]' } )
  fifthFib;
}

@DtoMappable()
export class ClassWithDefaultDecoratorAndOptionalNestedProperty {
  @OptionalProperty( { path: 'nested.fibs[3]' } )
  forthFib;
}

@DtoMappable()
export class ClassWithDefaultDecoratorAndReadOnlyProperties {
  @RequiredProperty( { path: 'important', readOnly: true } )
  doNotTouchThis;

  @OptionalProperty( { path: 'smart', readOnly: true } )
  doNotTouchThisValue;
}

@DtoMappable()
export class ClassWithDefaultDecoratorRequiredPropertyWithTransformFrom {
  @RequiredProperty( { path: 'five' } )
  @OnFromDto( v => v * 2 )
  ten;

  @RequiredProperty( { path: 'numbers' } )
  @OnFromDto( v => v.map( x => x * 3 ) )
  odds;
}

@DtoMappable()
export class ClassWithDefaultDecoratorRequiredPropertiesWithOnToDto {
  @RequiredProperty( { path: 'five' } )
  @OnToDto( v => v / 5 )
  ten;

  @RequiredProperty( { path: 'numbers' } )
  @OnToDto( v => v.map( x => x / 3 ) )
  odds;
}

@DtoMappable()
export class ClassWithDefaultDecoratorOptionalPropertyWithTransformFrom {
  @OptionalProperty( { path: 'seven' } )
  @OnFromDto( v => v * 3 )
  twentyOne;

  @OptionalProperty( { path: 'numbers' } )
  @OnFromDto( v => v.map( x => x * 4 ) )
  evens;
}

@DtoMappable()
export class ClassWithDefaultDecoratorOptionalPropertiesWithOnToDto {
  @OptionalProperty( { path: 'seven' } )
  @OnToDto( v => v * 4 )
  twentyOne;

  @OptionalProperty( { path: 'numbers' } )
  @OnToDto( v => v.map( x => x * 6 ) )
  evens;
}

@DtoMappable()
export class ClassWithDefaultDecoratorAndOptionalReadOnlyProperty {
  @OptionalProperty( { path: 'alsoImportant', readOnly: true } )
  doNotTouchThisTwo;
}

@DtoMappable()
export class ClassWithDefaultDecoratorAndOptionalPropertyWithDefault {
  @OptionalProperty( { path: 'cooper', defaultValue: 33 } )
  aDefaultValue;
}

@DtoMappable( { keepOriginal: true } )
export class ClassWithKeepOriginal {

  private foo: string;

  constructor( foo = 'KO' ) {
    this.foo = foo;
  }

  getFoo() {
    return this.foo;
  }
}


@DtoMappable( { keepOriginal: true } )
export class ClassWithKeepOriginalAndRequiredAndOptionalProperties {
  @RequiredProperty( { path: 'uno' } )
  requiredUno;

  @OptionalProperty( { path: 'dos' } )
  optionalDos;
}

@DtoMappable( { keepOriginal: true } )
export class ClassWithKeepOriginalAndRequiredAndOptionalNestedProperties {
  @RequiredProperty( { path: 'nested.fibs[4]' } )
  fifthFib;

  @OptionalProperty( { path: 'nested.fibs[2]' } )
  thirdFib;
}
