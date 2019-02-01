#!/usr/bin/env node
const yargs = require('yargs')
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
  .option('help', {
    alias: 'h',
    type: 'boolean',
    describe: 'Show this message'
  })
const {argv} = yargs

if (argv.help) {
  return yargs.showHelp()
}

const {promisify} = require('util')
const writeFile = promisify(require('fs').writeFile)
const {dirname, join} = require('path')
const deploy = require('.')

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
  .catch(error => {
    console.error(`deploy error: ${error}`)
    console.log(JSON.stringify(argv, null, 2))
    process.exitCode = 1
  })
