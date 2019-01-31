const {existsSync} = require('fs')

module.exports = function readJSON(path) {
  return existsSync(path) ? require(path) : undefined
}
