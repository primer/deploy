# primer/deploy
This [GitHub Action][github actions] deploys to [Now] and aliases the successful deployment to either:

* The `alias` field in `now.json` if the branch is `master`; or
* A branch-specific URL in the form `{name}-{branch}.now.sh`, where:
    * `{name}` is your app's name (in `now.json`, `package.json`, or the name of the directory);
    * `{branch}` is the part after `refs/heads/` in the `GITHUB_REF` [environment variable](https://developer.github.com/actions/creating-github-actions/accessing-the-runtime-environment/#environment-variables); and
    * Both strings are normalized in the alias to trim any leading non-alphanumeric characters and replace any sequence of non-alphanumeric characters with a single `-`.

## Status checks
Two [status checks] will be listed for this action in your checks: **deploy** is the action's check, and **deploy/alias** is a [commit status] created by the action that reports the URL and links to it via "Details":

![image](https://user-images.githubusercontent.com/113896/52000881-f8c45980-2472-11e9-8d04-00264094437b.png)

**Note:** Checks listed in the PR merge box (above) always point to the most recent commit, but you can access the list of [checks][status checks] for the last commit of every push by clicking on the status icon (usually a ![green check](https://user-images.githubusercontent.com/113896/52001573-99674900-2474-11e9-82ab-6414e3f004cf.png) or ![red x](https://user-images.githubusercontent.com/113896/52001543-88b6d300-2474-11e9-84ca-82ff51828ea9.png)) in your repo's "Commits" and "Branches" pages, or commit history on a PR page:

![image](https://user-images.githubusercontent.com/113896/52001489-64f38d00-2474-11e9-92ea-827e466eb948.png)

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

**You will need to provide a [Zeit token](https://zeit.co/account/tokens) value for the `NOW_TOKEN` secret in the Actions visual editor** if you haven't already.

To avoid racking up failed deployments, we suggest that you place this action after any linting and test actions.

[now]: https://zeit.co/now
[github actions]: https://github.com/features/actions
[commit status]: https://developer.github.com/v3/repos/statuses/
[status checks]: https://help.github.com/articles/about-status-checks/
