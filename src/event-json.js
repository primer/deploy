const {GITHUB_EVENT_PATH} = process.env
module.exports = GITHUB_EVENT_PATH ? require(GITHUB_EVENT_PATH) : {}
