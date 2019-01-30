const mockedEnv = require('mocked-env')
const getAlias = require('../get-alias')

describe('getAlias()', () => {
  it('works', () => {
    const restore = mockedEnv({GITHUB_REF: 'refs/heads/add-foo'})
    expect(getAlias('@primer/css')).toEqual('primer-css-add-foo.now.sh')
    restore()
  })
})
