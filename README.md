# primer/deploy

This GitHub Action deploys to [Now] and aliases the successful deployment to either:

* The `alias` field in `now.json` if the branch is `master`; or
* A branch-specific URL in the form `{name}-{branch}.now.sh`, where:
    * `{name}` is your app's name (in `now.json`, `package.json`, or the name of the directory);
    * `{branch}` is the part after `refs/heads/` in the `GITHUB_REF` [environment variable](https://developer.github.com/actions/creating-github-actions/accessing-the-runtime-environment/#environment-variables); and
    * Both strings are normalized in the alias to trim any leading non-alphanumeric characters and replace any sequence of non-alphanumeric characters with a single `-`.

## Usage
To use this action in your own workflow, add the following snippet to your `.github/main.workflow` file:

```hcl
action "deploy" {
  uses = "primer/deploy@master"
  secrets = [
    "GITHUB_TOKEN",
    "NOW_TOKEN",
  ]
}
```

**You will need to provide a [Zeit token](https://zeit.co/account/tokens) value for the `NOW_TOKEN` secret in the Actions visual editor** if you haven't already set one up.

To avoid racking up failed deployments, we suggest that you place this action after any linting and test actions.

[Now]: https://zeit.co/now
