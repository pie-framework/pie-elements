# pie-elements

A collection of pies.

### Commands

| Action            | Notes                                                                   |
| ----------------- | ----------------------------------------------------------------------- |
| test              | runs all the tests, all tests run from the root of the monorepo         |
| lint              | runs eslint                                                             |
| clean             | removes all the lib dirs                                                |
| release           | cleans, runs tests, builds, then runs lerna publish                     |
| pie-clean         | cleans out the `docs/demo` dir                                          |
| pie-install       | installs in the `docs/demo` dir                                         |
| pie-pack-clean    | cleans out the `docs/demo` dir + any generated assets from a `pie pack` |
| scripts/info $pkg | run `pie info` for a package, with watch enabled                        |

## running

> You need to have `pie>=10.1.1` installed | `npm install -g pie`.

```shell
cd packages/multiple-choice # or any other package.
pie info
```

## Tests

We are transitioning the repo to move all build/test functionality to the root of the repo (instead of having to install it in every package sub-package). Eventually you'll be able to run `npm test` from the root and all the tests will run.

For now it depends on the package.
