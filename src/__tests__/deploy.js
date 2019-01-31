const execa = require('execa')
const mockedEnv = require('mocked-env')
const readJSON = require('../read-json')
const deploy = require('../deploy')
const now = require('../now')
const commitStatus = require('../commit-status')

jest.mock('../now')
jest.mock('../read-json')
jest.mock('../commit-status')

commitStatus.mockImplementation(() => Promise.resolve({}))

describe('deploy()', () => {
  let restoreEnv = () => {}
  afterEach(() => {
    restoreEnv()
    // clear the call data
    now.mockReset()
    // restore the original behavior
    readJSON.mockReset()
  })

  it('calls now() once when w/o an alias', () => {
    mockFiles({
      'package.json': {name: 'foo'},
      'now.json': {},
      'rules.json': null
    })

    const url = 'foo-123.now.sh'
    now.mockImplementation((cmd, args, opts) => Promise.resolve(url))
    mockEnv({GITHUB_REF: ''})

    return deploy().then(res => {
      expect(res).toEqual({name: 'foo', root: url, url})
      expect(now).toHaveBeenCalledTimes(1)
      expect(now).toHaveBeenCalledWith()
    })
  })

  it('calls now() twice when there is an alias', () => {
    mockFiles({
      'package.json': {name: 'foo'},
      'now.json': {},
      'rules.json': null
    })

    const url = 'foo-123.now.sh'
    const alias = 'foo-bar.now.sh'
    now.mockImplementation((cmd, args, opts) => Promise.resolve(url))
    mockEnv({GITHUB_REF: 'refs/heads/bar'})

    return deploy().then(res => {
      expect(res).toEqual({name: 'foo', root: url, alias, url: alias})
      expect(now).toHaveBeenCalledTimes(2)
      expect(now).toHaveBeenNthCalledWith(1)
      expect(now).toHaveBeenNthCalledWith(2, ['alias', url, alias])
    })
  })

  it('calls now() three times when there is a rules.json', () => {
    const prodAlias = 'foo.now.sh'
    mockFiles({
      'package.json': {name: 'foo'},
      'now.json': {alias: prodAlias},
      // exists
      'rules.json': {}
    })

    const url = 'foo-123.now.sh'
    const alias = 'foo-bar.now.sh'
    now.mockImplementation((cmd, args, opts) => Promise.resolve(url))
    mockEnv({GITHUB_REF: 'refs/heads/bar'})

    return deploy().then(res => {
      expect(res).toEqual({name: 'foo', root: url, alias, url: prodAlias})
      expect(now).toHaveBeenCalledTimes(3)
      expect(now).toHaveBeenNthCalledWith(1)
      expect(now).toHaveBeenNthCalledWith(2, ['alias', url, alias])
      expect(now).toHaveBeenNthCalledWith(3, ['alias', alias, prodAlias, '-r', 'rules.json'])
    })
  })

  function mockEnv(env) {
    restoreEnv = mockedEnv(env)
  }

  function mockFiles(files) {
    readJSON.mockImplementation(path => {
      if (path in files) {
        return files[path]
      }
    })
  }
})
