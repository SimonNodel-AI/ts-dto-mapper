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
  @RequiredProperty( { path: 'uno' })
  requiredUno;
}


@Mapping()
export class ClassWithDefaultDecoratorAndRequiredNestedProperty {
  @RequiredProperty( { path: 'nested.fibs[4]' })
  fifthFib;
}


@Mapping({keepOriginal: true})
export class ClassWithKeepOriginal {

  private foo: string;

  constructor( foo = 'KO' ) {
    this.foo = foo;
  }

  getFoo() {
    return this.foo;
  }
}


@Mapping({keepOriginal: true})
export class ClassWithKeepOriginalAndRequiredProperty {
  @RequiredProperty( { path: 'uno' })
  requiredUno;
}

@Mapping({keepOriginal: true})
export class ClassWithKeepOriginalAndRequiredNestedProperty {
  @RequiredProperty( { path: 'nested.fibs[4]' })
  fifthFib;
}
