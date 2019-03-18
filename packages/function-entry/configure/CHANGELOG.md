# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.2.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-configure@2.2.0...@pie-element/function-entry-configure@2.2.1) (2019-03-18)

**Note:** Version bump only for package @pie-element/function-entry-configure





# [2.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-configure@2.1.0...@pie-element/function-entry-configure@2.2.0) (2019-03-18)


### Features

* **general:** initialize default model (2) ([#138](https://github.com/pie-framework/pie-elements/issues/138)) ([fc72eca](https://github.com/pie-framework/pie-elements/commit/fc72eca))





# [2.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-configure@2.0.4...@pie-element/function-entry-configure@2.1.0) (2019-03-13)


### Features

* **general:** initialize default model ([#129](https://github.com/pie-framework/pie-elements/issues/129)) ([b62d058](https://github.com/pie-framework/pie-elements/commit/b62d058))
* all elements on `develop` target [@next](https://github.com/next) releases ([d3766e6](https://github.com/pie-framework/pie-elements/commit/d3766e6))





## [2.0.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-configure@2.0.3...@pie-element/function-entry-configure@2.0.4) (2019-02-20)

**Note:** Version bump only for package @pie-element/function-entry-configure





## [2.0.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-configure@2.0.2...@pie-element/function-entry-configure@2.0.3) (2019-02-13)

**Note:** Version bump only for package @pie-element/function-entry-configure





## [2.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-configure@2.0.1...@pie-element/function-entry-configure@2.0.2) (2019-02-13)

**Note:** Version bump only for package @pie-element/function-entry-configure





## [2.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-configure@2.0.0...@pie-element/function-entry-configure@2.0.1) (2019-01-08)


### Bug Fixes

* **general:** bumped the config-ui version for all packages ([159521d](https://github.com/pie-framework/pie-elements/commit/159521d))





<a name="2.0.0"></a>
# 2.0.0 (2018-09-20)


### Bug Fixes

* build fixes ([3c3a7f2](https://github.com/pie-framework/pie-elements/commit/3c3a7f2))
* bump config-ui@^7.6.6 ([266235a](https://github.com/pie-framework/pie-elements/commit/266235a))


### Features

* **dependencies:** use latest dependencies ([5220ea2](https://github.com/pie-framework/pie-elements/commit/5220ea2))
* **dependencies:** use latest of [@pie-ui](https://github.com/pie-ui)/* ([ac9d2e5](https://github.com/pie-framework/pie-elements/commit/ac9d2e5))
* **function-entry:** add mathjs to function entry ([25ab268](https://github.com/pie-framework/pie-elements/commit/25ab268))
* **function-entry:** added function entry ([5523192](https://github.com/pie-framework/pie-elements/commit/5523192))
* **function-entry:** added hints popover ([3a6cfd3](https://github.com/pie-framework/pie-elements/commit/3a6cfd3))
* **function-entry:** finalized function-entry component ([6911a86](https://github.com/pie-framework/pie-elements/commit/6911a86))
* **function-entry:** getting ready for publish, final version ([972518a](https://github.com/pie-framework/pie-elements/commit/972518a))
* **function-entry:** hints popover fixes and adjustments ([8926f7b](https://github.com/pie-framework/pie-elements/commit/8926f7b))
* **model:** move away from legacy model, use latest feedback model. ([317a9c3](https://github.com/pie-framework/pie-elements/commit/317a9c3))
* upgrade material-ui -> [@material-ui](https://github.com/material-ui)/core@1.0.0-rc.1 ([12b45c7](https://github.com/pie-framework/pie-elements/commit/12b45c7))


### BREAKING CHANGES

* **model:** The model has moved from this:

```javascript
    {
      id: '1',
      element: 'function-entry',
      weight: 1,
      incorrectFeedback: {
        type: 'default',
      },
      correctResponse: {
        equation: '3x+2',
        feedback: {
          type: 'default',
        },
      },
      model: {
        showFormattingHelp: true
      }
    }

```

To this:

```javascript
    {
      id: '1',
      element: 'function-entry',
      weight: 1,
      showFormattingHelp: true,
      equation: '3x+2',
      feedback: {
        correct: {
          type: 'default',
          default: 'Correct'
        },
        incorrect: {
          type: 'default',
          default: 'Incorrect'
        }
      }
    }

```
