const fetch = require('isomorphic-unfetch')

module.exports = class Now {
  constructor(options) {
    const {version = 2, baseUrl = `https://api.zeit.co/v${version}/now`, headers = {}, token} = options
    this.options = options
    this.baseUrl = baseUrl
    this.headers = headers
    if (token) {
      this.headers.Authorization = `Bearer ${token}`
    }
  }

  get deployments() {
    return {
      list: (...args) => this.listDeployments(...args),
      get: (...args) => this.getDeployment(...args),
      remove: (...args) => this.removeDeployment(...args)
    }
  }

  get aliases() {
    return {
      list: (...args) => this.listAliases(...args),
      get: (...args) => this.getAlias(...args),
      remove: (...args) => this.removeAlias(...args)
    }
  }

  fetch(uri, options = {}) {
    const url = `${this.baseUrl}/${uri}`
    options.headers = Object.assign({}, this.headers, options.headers)
    return fetch(url, options).then(res => res.json())
  }

  listDeployments() {
    return this.fetch('deployments').then(data => data.deployments)
  }

  getDeployment(args) {
    const [id] = requireArgs(args, 'id')
    return this.fetch(`deployments/${id}`)
  }

  removeDeployment(args) {
    const [id] = requireArgs(args, 'id')
    return this.fetch(`deployments/${id}`, {method: 'DELETE'})
  }

  listAliases() {
    return this.fetch('aliases').then(data => data.aliases)
  }
}

function requireArgs(args, ...keys) {
  const values = []
  const missing = []
  for (const key of keys) {
    if (!args[key]) {
      missing.push(key)
    } else {
      values.push(args[key])
    }
  }
  if (missing.length > 1) {
    throw new Error(`Required arguments "${missing.join('", "')}" are missing in: ${JSON.stringify(args)}`)
  } else if (missing.length === 1) {
    throw new Error(`Required argument "${missing[0]}" is missing in: ${JSON.stringify(args)}`)
  }
  return values
}
