const log = require('./log')

module.exports = function nowDryRun(args) {
  log(`RUN: npx now`, ...args)
  return Promise.resolve('<deployed-url>')
}
