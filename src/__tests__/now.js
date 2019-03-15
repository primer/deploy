const execa = require('execa')
const mockedEnv = require('mocked-env')
const now = require('../now')

const {NOW_BIN} = now

jest.mock('execa')
execa.mockImplementation(() => Promise.resolve({stderr: '', stdout: ''}))

describe('now()', () => {
  let restoreEnv = () => {}
  afterEach(() => restoreEnv())

  it('throws if process.env.NOW_TOKEN is falsy', () => {
    mockEnv({NOW_TOKEN: ''})
    expect(() => now()).toThrow()
  })

  it('calls `npx now --token=$NOW_TOKEN` with no additional args', () => {
    mockEnv({NOW_TOKEN: 'xyz'})
    now()
    expect(execa).lastCalledWith(NOW_BIN, ['--token=xyz'], {stderr: 'inherit'})
  })

  it('calls with additional arguments passed as an array', () => {
    mockEnv({NOW_TOKEN: 'abc'})
    now(['foo', 'bar'])
    expect(execa).lastCalledWith(NOW_BIN, ['--token=abc', 'foo', 'bar'], {stderr: 'inherit'})
  })

  function mockEnv(env) {
    restoreEnv = mockedEnv(env)
  }
})
