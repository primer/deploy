#!/usr/bin/env node
const {dirname, join} = require('path')

const {NOW_TOKEN} = process.env
if (!NOW_TOKEN) {
  console.error(`You must set the NOW_TOKEN environment variable`)
  process.exit(1)
}

const args = process.argv.slice(2)
const deploy = require('./src/deploy')

deploy(args)
  .then(res => {
    console.warn(`[deploy] deployed: ${JSON.stringify(res)}`)
  })
  .catch(error => {
    console.error(`[deploy] ERROR: ${error}`)
    process.exitCode = 1
  })
