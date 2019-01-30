const mockedEnv = require('mocked-env')
const getBranch = require('../get-branch')

describe('getBranch()', () => {
  it('strips the leading "refs/heads/"', () => {
    const restore = mockedEnv({GITHUB_REF: 'refs/heads/foo'})
    expect(getBranch()).toEqual('foo')
    restore()
  })
})
