# pie-elements

A collection of pies.

### Commands

| Action         | Notes                                                                   |
| -------------- | ----------------------------------------------------------------------- |
| test           |                                                                         |
| lint           |                                                                         |
| release        |                                                                         |
| pie-clean      | cleans out the `docs/demo` dir                                          |
| pie-install    | cleans out the `docs/demo` dir                                          |
| pie-pack-clean | cleans out the `docs/demo` dir + any generated assets from a `pie pack` |

> TODO: pie-install

## running

> You need to have `pie>=10.1.1` installed | `npm install -g pie`.

```shell
cd packages/multiple-choice # or any other package.
pie info
```

## Tests

We are transitioning the repo to move all build/test functionality to the root of the repo (instead of having to install it in every package sub-package). Eventually you'll be able to run `npm test` from the root and all the tests will run.

For now it depends on the package.
