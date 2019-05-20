workflow "lint, test, deploy" {
  on = "push"
  resolves = [
    "lint",
    "test",
    "deploy",
    "publish",
  ]
}

workflow "clean up deployments" {
  on = "delete"
  resolves = ["delete branch"]
}

action "npm install" {
  uses = "actions/npm@master"
  runs = ["npm", "ci"]
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
  secrets = [
    "GITHUB_TOKEN",
    "NOW_TOKEN",
  ]
}

action "publish" {
  needs = ["test"]
  uses = "primer/publish@v1.0.0"
  secrets = [
    "GITHUB_TOKEN",
    "NPM_AUTH_TOKEN",
  ]
}

action "delete branch" {
  needs = "npm install"
  uses = "./"
  secrets = [
    "GITHUB_TOKEN",
    "NOW_TOKEN"
  ]
}
