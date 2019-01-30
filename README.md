# primer/deploy

This GitHub Action deploys to [Now] and aliases the successful deployment to either:

* The `alias` field in `now.json` if the branch is `master`; or
* A branch-specific URL in the form `{name}-{branch}.now.sh`, where:
    * `{name}` is your app's name (in `now.json`, `package.json`, or the name of the directory);
    * `{branch}` is the part after `refs/heads/` in the `GITHUB_REF` [environment variable](https://developer.github.com/actions/creating-github-actions/accessing-the-runtime-environment/#environment-variables); and
    * both strings are normalized to trim any leading non-alphanumeric characters and replace any sequence of non-alphanumeric characters with a single `-`.

[Now]: https://zeit.co/now
