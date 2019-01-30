const getBranch = require('./get-branch')
const slug = require('./slug')

module.exports = function getAlias(name) {
  const nameSlug = slug(name)
  const branch = getBranch()

  if (branch === 'master') {
    return `${nameSlug}.now.sh`
  } else if (branch) {
    return `${nameSlug}-${slug(branch)}.now.sh`
  }
}
