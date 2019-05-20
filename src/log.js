module.exports = function log(message, ...args) {
  console.warn(`[deploy] ${message}`, ...args)
}
