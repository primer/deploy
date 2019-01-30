const slug = require('../slug')

describe('slug', () => {
  it('normalizes "@primer/css" to "primer-css"', () => {
    expect(slug('@primer/css')).toEqual('primer-css')
  })
  it('preserves "primer-primitives"', () => {
    expect(slug('primer-primitives')).toEqual('primer-primitives')
  })
})
