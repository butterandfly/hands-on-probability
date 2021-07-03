import {getPieces} from './part-helper'

const part1 = `
1
<MCQuest />
2
<MCQuest/>
3
<Solution />
4

<MCQuest ab="1"></MCQuest>
5
<MCQuest>
* a<b
* b>1
</MCQuest>

<Solution>

</Solution>
6
`

const noComp = `
# Title
Hello here.
`

describe('compilePart function', () => {
  it('compiles a simple part', () => {
    const result = getPieces(part1, ['MCQuest', 'Solution']);
    expect(result.length).toBe(12);
  });

  it('compiles a pure markdown', () => {
    const result = getPieces(noComp, ['MCQuest', 'Solution']);
    expect(result.length).toBe(1);
  });
});