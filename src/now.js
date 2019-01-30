const execa = require('execa')

module.exports = function now(args = []) {
  const {NOW_TOKEN} = process.env
  if (!NOW_TOKEN) {
    throw new Error(`The NOW_TOKEN env var is required`)
  }
  return execa('npx', ['now', `--token=${NOW_TOKEN}`, ...args], {stderr: 'inherit'}).then(res => res.stdout)
}
