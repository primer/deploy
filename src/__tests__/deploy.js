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

  it('calls now() once when GITHUB_REF is unset', () => {
    mockFiles({
      'package.json': {name: 'foo'},
      'now.json': {},
      'rules.json': null
    })

    const root = 'foo-123.now.sh'
    now.mockImplementation(() => Promise.resolve(root))
    mockEnv({GITHUB_REF: ''})

    return deploy().then(res => {
      expect(now).toHaveBeenCalledTimes(1)
      expect(now).toHaveBeenCalledWith([])
      expect(res).toEqual({name: 'foo', root, url: root})
    })
  })

  it('deploys to a branch alias on branches other than master', () => {
    mockFiles({
      'package.json': {name: 'foo'},
      'now.json': {},
      'rules.json': null
    })

    const root = 'foo-123.now.sh'
    const alias = 'foo-bar.now.sh'
    now.mockImplementation(() => Promise.resolve(root))
    mockEnv({GITHUB_REF: 'refs/heads/bar'})

    return deploy().then(res => {
      expect(now).toHaveBeenCalledTimes(2)
      expect(now).toHaveBeenNthCalledWith(1, [])
      expect(now).toHaveBeenNthCalledWith(2, ['alias', root, alias])
      expect(res).toEqual({name: 'foo', root, alias, url: alias})
    })
  })

  it('deploys to the "alias" field from now.json on the master branch', () => {
    const name = 'hello'
    const alias = 'hello.world'
    mockFiles({
      'package.json': {name},
      'now.json': {alias},
      'rules.json': null
    })

    const root = 'hello-123.now.sh'
    now.mockImplementation(() => Promise.resolve(root))
    mockEnv({GITHUB_REF: 'refs/heads/master'})

    return deploy().then(res => {
      expect(now).toHaveBeenCalledTimes(2)
      expect(now).toHaveBeenNthCalledWith(1, [])
      expect(now).toHaveBeenNthCalledWith(2, ['alias', root, alias])
      expect(res).toEqual({name, root, url: alias})
    })
  })

  it('calls now() two times when there is a rules.json, not on master', () => {
    const prodAlias = 'foo.now.sh'
    mockFiles({
      'package.json': {name: 'foo'},
      'now.json': {alias: prodAlias},
      // exists
      'rules.json': {}
    })

    const root = 'foo-123.now.sh'
    const alias = 'foo-bar.now.sh'
    now.mockImplementation(() => Promise.resolve(root))
    mockEnv({GITHUB_REF: 'refs/heads/bar'})

    return deploy().then(res => {
      expect(now).toHaveBeenCalledTimes(2)
      expect(now).toHaveBeenNthCalledWith(1, [])
      expect(now).toHaveBeenNthCalledWith(2, ['alias', root, alias])
      expect(res).toEqual({name: 'foo', root, alias, url: alias})
    })
  })

  it('calls now() three times when there is a rules.json, on master', () => {
    const prodAlias = 'primer.style'
    mockFiles({
      'package.json': {name: 'primer-style'},
      'now.json': {alias: prodAlias},
      // exists
      'rules.json': {}
    })

    const root = 'primer-style-123.now.sh'
    const alias = 'primer-style.now.sh'
    now.mockImplementation(() => Promise.resolve(root))
    mockEnv({GITHUB_REF: 'refs/heads/master'})

    return deploy().then(res => {
      expect(now).toHaveBeenCalledTimes(3)
      expect(now).toHaveBeenNthCalledWith(1, [])
      expect(now).toHaveBeenNthCalledWith(2, ['alias', root, alias])
      expect(now).toHaveBeenNthCalledWith(3, ['alias', alias, prodAlias, '-r', 'rules.json'])
      expect(res).toEqual({name: 'primer-style', root, alias, url: prodAlias})
    })
  })

  it('appends arguments to the now cli call', () => {
    mockFiles({
      'package.json': {name: '@primer/css'},
      'now.json': {alias: 'primer-css.now.sh'},
      'rules.json': null
    })

    const root = 'primer-css-v12.now.sh'
    const alias = 'primer-css-v12.now.sh'
    now.mockImplementation(() => Promise.resolve(root))
    mockEnv({GITHUB_REF: 'refs/heads/v12'})

    return deploy('docs').then(res => {
      expect(now).toHaveBeenCalledTimes(2)
      expect(now).toHaveBeenNthCalledWith(1, ['docs'])
      expect(now).toHaveBeenNthCalledWith(2, ['docs', 'alias', root, alias])
      expect(res).toEqual({name: '@primer/css', root, alias, url: alias})
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
