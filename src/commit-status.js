const actionStatus = require('action-status')

module.exports = function createStatus(host, overrides = {}) {
  const {GITHUB_ACTION = 'deploy'} = process.env
  return actionStatus({
    context: `${GITHUB_ACTION}/alias`,
    state: 'success',
    description: `Aliased to ${host}`,
    url: `https://${host}`,
    ...overrides
  })
}
