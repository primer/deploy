workflow "lint, test, deploy" {
  resolves = ["lint", "test", "deploy"]
}

action "npm install" {
  uses = "docker://node:10-slim"
  runs = ["npm", "install"]
}

action "lint" {
  needs = ["npm install"]
  uses = "docker://node:10-slim"
  runs = ["npm", "run", "lint"]
}

action "test" {
  needs = ["npm install"]
  uses = "docker://node:10-slim"
  runs = ["npm", "test"]
}

action "deploy" {
  uses = "."
  secrets = [
    "GITHUB_TOKEN",
    "NOW_TOKEN",
  ]
}
