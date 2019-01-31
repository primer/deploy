const {dirname} = require('path')
const getBranch = require('./get-branch')
const commitStatus = require('./commit-status')
const getBranchAlias = require('./get-alias')
const now = require('./now')
const readJSON = require('./read-json')

module.exports = function deploy(...nowArgs) {
  const nowJson = readJSON('now.json') || {}
  const packageJson = readJSON('package.json') || {}
  const rulesJson = readJSON('rules.json')

  const name = nowJson.name || packageJson.name || dirname(process.cwd())
  const branch = getBranch(name)

  console.log(`[deploy] deploying "${name}" with now...`)
  return now(nowArgs)
    console.log('⚠️⚠️⚠️⚠️ now args!', nowArgs)
    .then(url => {
      if (url) {
        // console.log(`[deploy] deployed to: ${url}`)
        return {
          name,
          root: url,
          url
        }
      } else {
        throw new Error(`Unable to get deployment URL from now: ${url}`)
      }
    })
    .then(res => {
      const {url} = res
      const prodAlias = nowJson.alias
      if (branch === 'master' && !rulesJson) {
        res.url = prodAlias
        return now([...nowArgs, 'alias', url, prodAlias])
          .then(() => commitStatus(prodAlias))
          .then(() => res)
      }
      const branchAlias = getBranchAlias(name, branch)
      if (branchAlias) {
        res.url = res.alias = branchAlias
        return now([...nowArgs, 'alias', url, branchAlias])
          .then(() => commitStatus(branchAlias))
          .then(() => {
            if (branch === 'master' && rulesJson) {
              const {alias} = res
              if (!prodAlias) {
                console.warn(`[deploy] no alias field in now.json!`)
                return res
              } else if (prodAlias === alias) {
                console.warn(`[deploy] already aliased to production URL: ${alias}; skipping rules.json`)
                return res
              }
              res.url = prodAlias
              return now([...nowArgs, 'alias', '-r', 'rules.json', alias, prodAlias]).then(() =>
                commitStatus(prodAlias)
              )
            }
          })
          .then(() => res)
      } else {
        return res
      }
    })
}
