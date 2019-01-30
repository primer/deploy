const {dirname} = require('path')
const now = require('./now')
const getAlias = require('./get-alias')
const commitStatus = require('./commit-status')

module.exports = function deploy(args) {
  const nowJson = require('./now-json')
  const packageJson = require('./package-json')
  const name = nowJson.name || packageJson.name || dirname(process.cwd())
  console.log(`[deploy] deploying "${name}" with now...`)
  return now(args)
    .then(url => {
      if (url) {
        console.log(`[deploy] deployed to: ${url}`)
        return {name, root: url, url}
      } else {
        throw new Error(`Unable to get deployment URL from now: ${url}`)
      }
    })
    .then(res => {
      const {url} = res
      const alias = getAlias(name)
      if (alias) {
        res.url = alias
        return now(['alias', ...args, url, alias])
          .then(() => commitStatus(alias))
          .then(() => res)
      }
    })
}
