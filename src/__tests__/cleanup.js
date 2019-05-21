const tempfile = require('tempfile')
const {writeFileSync} = require('fs')
const mockedEnv = require('mocked-env')
const readJSON = require('../read-json')
const cleanup = require('../cleanup')
const now = require('../now')

jest.mock('../now')
jest.mock('../read-json')

// the default now() mock implementation just returns a fake URL
const nowMockImpl = () => Promise.resolve()

// we need to be sure to mock this before every test so that it
// doesn't *actually* run
now.mockImplementation(nowMockImpl)

describe('cleanup()', () => {
  let restoreEnv = () => {}

  afterEach(() => {
    restoreEnv()
    readJSON.mockReset()
    now.mockReset()
  })

  it(`calls now(['remove', '--yes', <alias>]) if event.ref is set`, () => {
    const name = 'foo'
    const ref = 'feature-branch'
    const alias = `${name}-${ref}.now.sh`

    mockEnv({GITHUB_EVENT_PATH: mockEventJSON({ref})})

    mockFiles({
      'package.json': {name},
      'now.json': {},
      'rules.json': null
    })

    return cleanup().then(res => {
      expect(now).toHaveBeenCalledTimes(1)
      expect(now).toHaveBeenCalledWith(['remove', '--yes', alias])
      expect(res).toEqual({
        removed: true,
        name,
        branch: ref,
        alias
      })
    })
  })

  it(`returns a no-op if there is no event.ref`, () => {
    const name = 'bar'
    mockFiles({
      'package.json': {name},
      'now.json': {},
      'rules.json': null
    })

    mockEnv({GITHUB_EVENT_PATH: mockEventJSON({})})

    return cleanup().then(res => {
      expect(now).toHaveBeenCalledTimes(0)
      expect(res).toEqual({
        removed: false,
        name,
        branch: undefined,
        alias: undefined,
        message: 'No branch ref detected'
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

  function mockEventJSON(data) {
    const path = tempfile('.json')
    writeFileSync(path, JSON.stringify(data), 'utf8')
    return path
  }
})
