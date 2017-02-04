export class Mapper {

  static from<T>( mappingInfo: any, source: any = {}, ...params ): T {
    const instance = new mappingInfo( ...params );

    if ( instance._mappingMeta.options.keepOriginal ) {
      instance._mappingMeta.original = source;
    }

    return <T>instance;
  }

}
