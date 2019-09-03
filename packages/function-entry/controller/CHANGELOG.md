# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-controller@2.1.6...@pie-element/function-entry-controller@2.2.0) (2019-08-27)


### Features

* Session null/empty check ([0538211](https://github.com/pie-framework/pie-elements/commit/0538211))





## [2.1.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-controller@2.1.5...@pie-element/function-entry-controller@2.1.6) (2019-08-26)

**Note:** Version bump only for package @pie-element/function-entry-controller





## [2.1.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-controller@2.1.4...@pie-element/function-entry-controller@2.1.5) (2019-08-15)

**Note:** Version bump only for package @pie-element/function-entry-controller





## [2.1.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-controller@2.1.3...@pie-element/function-entry-controller@2.1.4) (2019-03-18)

**Note:** Version bump only for package @pie-element/function-entry-controller





## [2.1.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-controller@2.1.2...@pie-element/function-entry-controller@2.1.3) (2019-03-18)

**Note:** Version bump only for package @pie-element/function-entry-controller





## [2.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-controller@2.1.1...@pie-element/function-entry-controller@2.1.2) (2019-03-18)

**Note:** Version bump only for package @pie-element/function-entry-controller





## [2.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry-controller@2.1.0...@pie-element/function-entry-controller@2.1.1) (2019-03-18)

**Note:** Version bump only for package @pie-element/function-entry-controller





# 2.1.0 (2019-03-13)


### Features

* **general:** initialize default model ([#129](https://github.com/pie-framework/pie-elements/issues/129)) ([b62d058](https://github.com/pie-framework/pie-elements/commit/b62d058))





<a name="2.0.0"></a>
# 2.0.0 (2018-09-20)


### Bug Fixes

* **controller:** bump feedback version ([a07c9ec](https://github.com/pie-framework/pie-elements/commit/a07c9ec))
* **dependecies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([4be839f](https://github.com/pie-framework/pie-elements/commit/4be839f))
* **dependencies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([6fea7bb](https://github.com/pie-framework/pie-elements/commit/6fea7bb))
* build fixes ([3c3a7f2](https://github.com/pie-framework/pie-elements/commit/3c3a7f2))


### Features

* **dependencies:** use latest dependencies ([5220ea2](https://github.com/pie-framework/pie-elements/commit/5220ea2))
* **function-entry:** add mathjs to function entry ([25ab268](https://github.com/pie-framework/pie-elements/commit/25ab268))
* **function-entry:** added function entry ([5523192](https://github.com/pie-framework/pie-elements/commit/5523192))
* **function-entry:** feedback and peer fixes, mathjs comparison fix ([f62ec87](https://github.com/pie-framework/pie-elements/commit/f62ec87))
* **function-entry:** finalized for publish ([25236e3](https://github.com/pie-framework/pie-elements/commit/25236e3))
* **function-entry:** finalized function-entry component ([6911a86](https://github.com/pie-framework/pie-elements/commit/6911a86))
* **model:** move away from legacy model, use latest feedback model. ([317a9c3](https://github.com/pie-framework/pie-elements/commit/317a9c3))


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
