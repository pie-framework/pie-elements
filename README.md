# pie-elements

A collection of pies. These packages are pie packages in that they have an optional `configure` and/or `controller` sub package.

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

Each package need to be built w/ babel before you can use it.

The following script:

```shell
scripts/info $package
```

Will run a watched babel process and the run `pie info`.

> You need to have `pie>=10.1.1` installed | `npm install -g pie`.

## Tests

```shell
npm test
```
