import { TypescriptObjectMapperPage } from './app.po';

describe('typescript-object-mapper App', function() {
  let page: TypescriptObjectMapperPage;

  beforeEach(() => {
    page = new TypescriptObjectMapperPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
