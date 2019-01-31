const fs = require('fs')
const {dirname, join} = require('path')
const commitStatus = require('./commit-status')
const getAlias = require('./get-alias')
const now = require('./now')
const readJSON = require('./read-json')

module.exports = function deploy(args = []) {
  const nowJson = readJSON('now.json') || {}
  const packageJson = readJSON('package.json') || {}
  const rulesJson = readJSON('rules.json')
  const name = nowJson.name || packageJson.name || dirname(process.cwd())

  console.log(`[deploy] deploying "${name}" with now...`)
  return now()
    .then(url => {
      if (url) {
        // console.log(`[deploy] deployed to: ${url}`)
        return {name, root: url, url}
      } else {
        throw new Error(`Unable to get deployment URL from now: ${url}`)
      }
    })
    .then(res => {
      const {url} = res
      const alias = getAlias(name)
      if (alias) {
        res.url = res.alias = alias
        return now(['alias', ...args, url, alias])
          .then(() => commitStatus(alias))
          .then(() => {
            if (rulesJson) {
              const {alias} = res
              const prodAlias = nowJson.alias
              if (!prodAlias) {
                console.warn(`[deploy] no alias field in now.json!`)
                return res
              } else if (prodAlias === alias) {
                console.warn(`[deploy] already aliased to production URL: ${alias}; skipping rules.json`)
                return res
              }
              res.url = prodAlias
              return now(['alias', ...args, alias, prodAlias, '-r', 'rules.json'])
                .then(() => commitStatus(prodAlias))
            }
          })
          .then(() => res)
      } else {
        return res
      }
    })
}
