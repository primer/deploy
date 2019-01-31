const {join} = require('path')
const readJSON = require('./read-json')

module.exports = readJSON(join(process.cwd(), 'now.json')) || {}
