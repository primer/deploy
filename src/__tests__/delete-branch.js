const mockedEnv = require('mocked-env')
const readJSON = require('../read-json')
const deleteBranch = require('../delete-branch')
const now = require('../now')

jest.mock('../now')
jest.mock('../read-json')

// the default now() mock implementation just returns a fake URL
const nowMockImpl = () => Promise.resolve()

// we need to be sure to mock this before every test so that it
// doesn't *actually* run
now.mockImplementation(nowMockImpl)

describe('deleteBranch()', () => {
  let restoreEnv = () => {}

  afterEach(() => {
    restoreEnv()
    readJSON.mockReset()
    now.mockReset()
  })

  it(`calls now(['remove', '--yes', <alias>])`, () => {
    mockFiles({
      'package.json': {name: 'foo'},
      'now.json': {},
      'rules.json': null
    })

    const alias = 'foo-feature-branch.now.sh'
    mockEnv({GITHUB_REF: 'refs/heads/feature-branch'})

    return deleteBranch().then(res => {
      expect(now).toHaveBeenCalledTimes(1)
      expect(now).toHaveBeenCalledWith(['remove', '--yes', 'foo-feature-branch.now.sh'])
      expect(res).toEqual({
        deleted: true,
        name: 'foo',
        branch: 'feature-branch',
        alias
      })
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
