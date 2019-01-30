const fs = require('fs')
const {join} = require('path')
const nowPath = join(process.cwd(), 'now.json')
module.exports = fs.existsSync(nowPath) ? require(nowPath) : {}
