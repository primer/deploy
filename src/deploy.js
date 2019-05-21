const getAppName = require('./get-app-name')
const getBranch = require('./get-branch')
const aliasStatus = require('./alias-status')
const getBranchAlias = require('./get-alias')
const readJSON = require('./read-json')
const retry = require('./retry')
const log = require('./log')

const CONFIG_KEY = '@primer/deploy'
const DEFAULT_RETRIES = 3

module.exports = function deploy(options = {}, nowArgs = []) {
  const now = options.dryRun ? require('./dry-run') : require('./now')

  const nowJson = readJSON('now.json') || {}
  const packageJson = readJSON('package.json') || {}
  const rulesJson = readJSON('rules.json')

  const config = packageJson[CONFIG_KEY] || {}
  const {releaseBranch = 'master'} = config

  const configAndOptions = Object.assign({}, config, options)
  const {verify = false, retries = DEFAULT_RETRIES} = configAndOptions

  const name = getAppName({nowJson, packageJson})
  const branch = getBranch()

  log(`deploying "${name}" with now...`)
  const deployArgs = nowJson.version === 2
    ? nowArgs
    : verify ? nowArgs : ['--no-verify', ...nowArgs]
  return retry(() => now(deployArgs), retries)
    .then(url => {
      if (url) {
        log(`root deployment: ${url}`)
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
      if (branch === releaseBranch && !rulesJson) {
        if (!prodAlias) {
          log(`No "alias" defined in now.json; skipping production alias.`)
          return res
        }
        res.url = prodAlias
        return now([...nowArgs, 'alias', url, prodAlias])
          .then(() => aliasStatus(prodAlias, config.status))
          .then(() => res)
      }
      const branchAlias = getBranchAlias(name, branch)
      if (branchAlias) {
        res.url = res.alias = branchAlias
        return now([...nowArgs, 'alias', url, branchAlias])
          .then(() => aliasStatus(branchAlias, config.status))
          .then(() => {
            if (branch === releaseBranch && rulesJson) {
              const {alias} = res
              if (!prodAlias) {
                log(`No "alias" defined in now.json; skipping rules.json`)
                return res
              } else if (prodAlias === alias) {
                log(`already aliased to production URL: ${alias}; skipping rules.json`)
                return res
              }
              res.url = prodAlias
              return now([...nowArgs, 'alias', '-r', 'rules.json', prodAlias]).then(() =>
                aliasStatus(prodAlias, config.status)
              )
            }
          })
          .then(() => res)
      } else {
        return res
      }
    })
}

Object.assign(module.exports, {DEFAULT_RETRIES})
