const actionStatus = require('action-status')

module.exports = function aliasStatus(host, overrides = {}) {
  const {GITHUB_ACTION = 'deploy'} = process.env
  return actionStatus(
    Object.assign(
      {
        context: `${GITHUB_ACTION}/alias`,
        state: 'success',
        description: `Aliased to ${host}`,
        url: `https://${host}`
      },
      overrides
    )
  )
}
