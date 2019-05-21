#!/usr/bin/env node
const meta = require('github-action-meta')
const {deploy, cleanup} = require('.')
const {DEFAULT_RETRIES} = deploy
const yargs = require('yargs')
  .usage('$0 [options]')
  .option('out', {
    alias: 'o',
    type: 'string',
    describe: 'Write deployment data in JSON to the given file'
  })
  .option('dry-run', {
    alias: 'n',
    type: 'boolean',
    describe: `Print the sequence of commands, but don't actually run anything`
  })
  .option('retries', {
    alias: 'r',
    type: 'number',
    default: DEFAULT_RETRIES,
    describe: 'Re-try deployment this number of times before giving up'
  })
  .option('verify', {
    type: 'boolean',
    describe: 'Unless provided, pass --no-verify to the Now CLI'
  })
  .option('help', {
    alias: 'h',
    type: 'boolean',
    describe: 'Show this message'
  })
const {argv} = yargs

if (argv.help) {
  yargs.showHelp()
  process.exit(0)
}

const {promisify} = require('util')
const writeFile = promisify(require('fs').writeFile)

const {event} = meta
const payload = event.data

const reportError = message => {
  return error => {
    console.error(`${message}: ${error}`)
    console.log(JSON.stringify(argv, null, 2))
    process.exitCode = 1
  }
}

if (event.name === 'push' && !event.deleted) {
  console.warn(`This looks like a push; deploying...`)
  deploy(argv, nowArgs)
    .then(res => {
      // write the message to stderr...
      console.warn(`deploy completed!`)
      const data = JSON.stringify(res, null, 2)
      if (argv.out) {
        return writeFile(argv.out, data, 'utf8')
      } else {
        console.log(data)
      }
    })
    .catch(reportError('deploy error'))
} else if (event.name === 'delete' && payload.ref_type === 'branch') {
  console.warn(`This looks like a branch delete; cleaning up...`)
  cleanup(argv, nowArgs)
    .then(deleted => {
      if (deleted) {
        console.warn(`branch ${deleted.branch} deleted`)
      } else {
        console.warn(`(nothing deleted)`)
      }
    })
    .catch(reportError('branch delete error'))
} else {
  console.warn(`Bailing because this doesn't look like a push or branch delete:`)
  console.warn(`GITHUB_EVENT_NAME=${event.name}; JSON payload: `, JSON.stringify(payload, null, 2))
  process.exit(0)
}
