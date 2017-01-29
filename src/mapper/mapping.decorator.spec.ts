import { TestBed, async } from '@angular/core/testing';
import { Mapping } from './mapping.decorator';
import { MappingOptions } from './mapping-options.interface';


describe('Mapping', () => {

  it('should return a decorator function', async(() => {
    const decorator = Mapping('testName', { keepOriginal: true });
    expect(decorator).toBeDefined();
  }));

  describe('decorator', () => {

    it('should add _mappingMeta property', async(() => {

      const decorator = Mapping('testName', { keepOriginal: true });
      const testFunction = function() {};
      const decoratedConstructor = decorator(testFunction);
      const result = new decoratedConstructor();

      expect(result._mappingMeta).toBeDefined();
      expect(result._mappingMeta.name).toBe('testName');
    }));

  });
});
