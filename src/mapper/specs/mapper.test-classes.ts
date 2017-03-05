import { OptionalProperty } from '../optional-property.decorator';
import { RequiredProperty } from '../required-property.decorator';
import { Mapping } from '../mapping.decorator';

@Mapping()
export class ClassWithDefaultDecorator {
  private foo: string;

  constructor( foo = 'DD' ) {
    this.foo = foo;
  }

  getFoo() {
    return this.foo;
  }
}


@Mapping()
export class ClassWithDefaultDecoratorAndRequiredProperty {
  @RequiredProperty( { path: 'uno' } )
  requiredUno;
}

@Mapping()
export class ClassWithDefaultDecoratorAndOptionalProperty {
  @OptionalProperty( { path: 'dos' } )
  optionalDos;
}

@Mapping()
export class ClassWithDefaultDecoratorAndRequiredNestedProperty {
  @RequiredProperty( { path: 'nested.fibs[4]' } )
  fifthFib;
}

@Mapping()
export class ClassWithDefaultDecoratorAndOptionalNestedProperty {
  @OptionalProperty( { path: 'nested.fibs[3]' } )
  forthFib;
}

@Mapping()
export class ClassWithDefaultDecoratorAndReadOnlyProperties {
  @RequiredProperty( { path: 'important', readOnly: true } )
  doNotTouchThis;

  @OptionalProperty( { path: 'smart', readOnly: true } )
  doNotTouchThisValue;
}

@Mapping()
export class ClassWithDefaultDecoratorAndOptionalReadOnlyProperty {
  @OptionalProperty( { path: 'alsoImportant', readOnly: true } )
  doNotTouchThisTwo;
}

@Mapping()
export class ClassWithDefaultDecoratorAndOptionalPropertyWithDefault {
  @OptionalProperty( { path: 'cooper', defaultValue: 33 } )
  aDefaultValue;
}

@Mapping( { keepOriginal: true } )
export class ClassWithKeepOriginal {

  private foo: string;

  constructor( foo = 'KO' ) {
    this.foo = foo;
  }

  getFoo() {
    return this.foo;
  }
}


@Mapping( { keepOriginal: true } )
export class ClassWithKeepOriginalAndRequiredAndOptionalProperties {
  @RequiredProperty( { path: 'uno' } )
  requiredUno;

  @OptionalProperty( { path: 'dos' } )
  optionalDos;
}

@Mapping( { keepOriginal: true } )
export class ClassWithKeepOriginalAndRequiredAndOptionalNestedProperties {
  @RequiredProperty( { path: 'nested.fibs[4]' } )
  fifthFib;

  @OptionalProperty( { path: 'nested.fibs[2]' } )
  thirdFib;
}
