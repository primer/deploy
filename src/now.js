const execa = require('execa')

module.exports = function now(args = []) {
  const {NOW_TOKEN} = process.env
  if (!NOW_TOKEN) {
    throw new Error(`The NOW_TOKEN env var is required`)
  }
  const nowArgs = ['now', `--token=${NOW_TOKEN}`, ...args]
  console.log('💖💖💖now args in now.js', args)
  return execa('npx', nowArgs, {stderr: 'inherit'}).then(res => res.stdout)
}
