const {dirname} = require('path')
const readJSON = require('./read-json')

module.exports = function getAppName(options = {}) {
  const {
    nowJson = readJSON('now.json') || {},
    packageJson = readJSON('package.json') || {}
  } = options
  return nowJson.name || packageJson.name || dirname(process.cwd())
}
