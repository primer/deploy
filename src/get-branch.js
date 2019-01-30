module.exports = function getBranch() {
  const {GITHUB_REF = ''} = process.env
  return GITHUB_REF.replace('refs/heads/', '')
}
