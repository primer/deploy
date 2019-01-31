const mockedEnv = require('mocked-env')
const getBranch = require('../get-branch')

describe('getBranch()', () => {
  it('strips the leading "refs/heads/"', () => {
    const restore = mockedEnv({GITHUB_REF: 'refs/heads/foo'})
    expect(getBranch()).toEqual('foo')
    restore()
  })

  it('returns an empty string if GITHUB_REF is unset', () => {
    const restore = mockedEnv({GITHUB_REF: undefined})
    expect(getBranch()).toEqual('')
    restore()
  })
})
