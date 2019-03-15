const execa = require('execa')

const {
  bin: {now: NOW_BIN_PATH}
} = require('now/package.json')
const NOW_BIN = require.resolve(`now/${NOW_BIN_PATH}`)

module.exports = function now(args = []) {
  const {NOW_TOKEN} = process.env
  if (!NOW_TOKEN) {
    throw new Error(`The NOW_TOKEN env var is required`)
  }
  const nowArgs = [`--token=${NOW_TOKEN}`, ...args]
  return execa(NOW_BIN, nowArgs, {stderr: 'inherit'}).then(res => res.stdout)
}

Object.assign(module.exports, {NOW_BIN})
