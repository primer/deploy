#!/usr/bin/env node
const meta = require('github-action-meta')
const {deploy, deleteBranch} = require('.')
const {DEFAULT_RETRIES} = deploy
const yargs = require('yargs')
  .usage('$0 [command] [options]')
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

let command = argv._[0]
const {event} = meta

if (event === 'delete') {
  command = 'delete'
} else if (event === 'push') {
  command = 'deploy'
}

if (!command || command === '--') {
  command = 'deploy'
}

const reportError = message => {
  return error => {
    console.error(`${message}: ${error}`)
    console.log(JSON.stringify(argv, null, 2))
    process.exitCode = 1
  }
}

switch (command) {
  case 'delete':
    deleteBranch(argv, argv._)
      .then(deleted => {
        if (deleted) {
          console.warn(`branch ${deleted.branch} deleted`)
        } else {
          console.warn(`(nothing deleted)`)
        }
      })
      .catch(reportError('branch delete error'))
    break

  case 'deploy':
    deploy(argv, argv._)
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
    break

  default:
    throw new Error(`Unrecognized command: "${command}" (${JSON.stringify(argv, null, 2)}`)
}
