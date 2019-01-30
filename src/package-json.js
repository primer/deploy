const fs = require('fs')
const path = require('path')
const packagePath = path.join(process.cwd(), 'package.json')
module.exports = fs.existsSync(packagePath) ? require(packagePath) : {}
