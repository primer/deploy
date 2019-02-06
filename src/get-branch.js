const meta = require('github-action-meta')
module.exports = () => meta.git.branch || ''
