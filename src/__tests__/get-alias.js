const getAlias = require('../get-alias')

describe('getAlias()', () => {
  it('works', () => {
    expect(getAlias('@primer/css', 'add-foo')).toEqual('primer-css-add-foo.now.sh')
  })
})
