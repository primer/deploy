workflow "lint, test, deploy, publish" {
  on = "push"
  resolves = [
    "lint",
    "test",
    "deploy",
    "publish",
  ]
}

action "npm install" {
  uses = "actions/npm@master"
  runs = "npm ci"
}

action "lint" {
  needs = "npm install"
  uses = "actions/npm@master"
  runs = "npm run lint"
}

action "test" {
  needs = "npm install"
  uses = "actions/npm@master"
  runs = "npm test"
}

action "deploy" {
  needs = "test"
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
