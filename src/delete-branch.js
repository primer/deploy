const getAppName = require('./get-app-name')
const getBranch = require('./get-branch')
const getBranchAlias = require('./get-alias')

module.exports = function deleteBranch(options = {}, nowArgs = []) {
  const now = options.dryRun ? require('./dry-run') : require('./now')
  const name = getAppName()
  const branch = getBranch()
  const alias = getBranchAlias(name, branch)
  return now([...nowArgs, 'remove', '--yes', alias]).then(() => {
    return {
      deleted: true,
      alias,
      name,
      branch
    }
  })
}
