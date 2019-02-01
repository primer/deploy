const {post} = require('commit-status')

module.exports = function commitStatus(host) {
  const {GITHUB_ACTION = 'deploy', GITHUB_REPOSITORY, GITHUB_SHA, GITHUB_TOKEN = ''} = process.env
  const [owner, repo] = GITHUB_REPOSITORY.split('/')
  return post({
    token: GITHUB_TOKEN,
    owner,
    repo,
    sha: GITHUB_SHA,
    context: `${GITHUB_ACTION}/alias`,
    state: 'success',
    description: `Aliased to ${host}`,
    url: `https://${host}`
  })
}
