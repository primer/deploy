const readJSON = require('../read-json')

describe('readJSON()', () => {
  it('reads package.json from the cwd', () => {
    const pkg = readJSON('package.json')
    expect(pkg instanceof Object).toBe(true)
  })

  it('returns undefined for non-existent files', () => {
    expect(readJSON('x.json')).toBe(undefined)
  })
})
