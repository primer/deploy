const getAppName = require('./get-app-name')
const getBranch = require('./get-branch')
const getBranchAlias = require('./get-alias')
const now = require('./now')

module.exports = function deleteBranch(options = {}, nowArgs = []) {
  const {dryRun = false} = options
  const now = dryRun ? nowDryRun : require('./now')
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
