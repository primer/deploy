module.exports = function retry(fn, times) {
  if (times < 0 || !isFinite(times)) {
    throw new Error(`retry() expects a positive number of times; got: ${times}`)
  }
  let count = 0
  return next()

  function next() {
    // console.warn(`[retry ${count}]`)
    return fn().catch(error => {
      if (++count < times) {
        // console.warn(`[retry ${count} failed; trying again]`)
        return next()
      } else {
        // console.warn(`[retry failed ${count} times]`)
        throw error
      }
    })
  }
}
