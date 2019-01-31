const {resolve} = require('path')
const {existsSync} = require('fs')

module.exports = function readJSON(path) {
  const resolved = resolve(process.cwd(), path)
  return existsSync(resolved) ? require(resolved) : undefined
}
