const meta = require('github-action-meta')
const getAppName = require('./get-app-name')
const getBranch = require('./get-branch')
const getBranchAlias = require('./get-alias')

module.exports = function cleanup(options = {}, nowArgs = []) {
  const now = options.dryRun ? require('./dry-run') : require('./now')
  const name = getAppName()
  const branch = meta.event.data.ref
  const alias = getBranchAlias(name, branch)
  const result = {branch, alias, name, removed: false}
  if (!branch || !alias) {
    result.message = branch ? 'No alias found' : 'No branch ref detected'
    return Promise.resolve(result)
  }
  return now([...nowArgs, 'remove', '--yes', alias]).then(() => {
    result.removed = true
    return result
  })
}
