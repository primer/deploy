workflow "lint, test, deploy" {
  on = "push"
  resolves = ["lint", "test", "deploy"]
}

action "npm install" {
  uses = "actions/npm@master"
  runs = ["npm", "install"]
}

action "lint" {
  needs = ["npm install"]
  uses = "actions/npm@master"
  runs = ["npm", "run", "lint"]
}

action "test" {
  needs = ["npm install"]
  uses = "actions/npm@master"
  runs = ["npm", "test"]
}

action "deploy" {
  needs = ["test"]
  uses = "./"
  args = "--help"
  secrets = [
    "GITHUB_TOKEN",
    "NOW_TOKEN",
  ]
}
