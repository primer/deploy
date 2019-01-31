const slug = require('./slug')

module.exports = function getAlias(name, branch) {
  const nameSlug = slug(name)

  if (branch === 'master') {
    return `${nameSlug}.now.sh`
  } else if (branch) {
    return `${nameSlug}-${slug(branch)}.now.sh`
  }
}
