import {genSectionUrl} from './utils'

describe('genSectionUrl function', () => {
  it('generates correct url', () => {
    expect(genSectionUrl('01-01')).toBe('/lessons/01/sections/01-01');
  });
});