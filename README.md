# pie-elements

A collection of pies. These packages are pie packages in that they have an optional `configure` and/or `controller` sub package.

## Install

```shell
yarn install # install monorepo dependencies
lerna bootstrap # symlinks any dependencies, uses yarn workspaces to speed up install
```

### pie global

For some of the scripts you'll need the pie cli installed (note that you must use npm to install this)

```shell
npm install -g pie
```

### Commands

| Action             | Notes                                                                   |
| ------------------ | ----------------------------------------------------------------------- |
| test               | runs all the tests, all tests run from the root of the monorepo         |
| build              | build the libs                                                          |
| lint               | runs eslint                                                             |
| clean              | removes all the lib dirs                                                |
| release            | cleans, runs tests, builds, then runs lerna publish                     |
| pie-clean          | cleans out the `docs/demo` dir                                          |
| pie-install        | installs in the `docs/demo` dir                                         |
| pie-pack-clean     | cleans out the `docs/demo` dir + any generated assets from a `pie pack` |
| scripts/info \$pkg | run `pie info` for a package, with watch enabled                        |

> when building make sure all watchers are disabled - we had an issue where a watcher was corrupting the build.

## running

Each package need to be built w/ babel before you can use it.

The following script:

```shell
scripts/info $package
```

Will run a watched babel process and the run `pie info`.

> You need to have `pie>=10.1.1` installed | `npm install -g pie`.

## Tests

All tests are run from the root of the repo.

> Don't add any test `devDependencies` or `jest.config.js` etc in the packages - it's unnecessary and can break the tests.

```shell
npm test
```

## CI

We use circleci - see .circleci/config.yml
