# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.4.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.4.2...@pie-element/function-entry@3.4.3) (2019-03-18)

**Note:** Version bump only for package @pie-element/function-entry





## [3.4.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.4.1...@pie-element/function-entry@3.4.2) (2019-03-18)

**Note:** Version bump only for package @pie-element/function-entry





## [3.4.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.4.0...@pie-element/function-entry@3.4.1) (2019-03-18)

**Note:** Version bump only for package @pie-element/function-entry





# [3.4.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.3.0...@pie-element/function-entry@3.4.0) (2019-03-18)


### Features

* **general:** initialize default model (2) ([#138](https://github.com/pie-framework/pie-elements/issues/138)) ([fc72eca](https://github.com/pie-framework/pie-elements/commit/fc72eca))





# [3.3.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.2.2...@pie-element/function-entry@3.3.0) (2019-03-13)


### Features

* **general:** initialize default model ([#129](https://github.com/pie-framework/pie-elements/issues/129)) ([b62d058](https://github.com/pie-framework/pie-elements/commit/b62d058))
* all elements on `develop` target [@next](https://github.com/next) releases ([d3766e6](https://github.com/pie-framework/pie-elements/commit/d3766e6))
* update schema docs ([#136](https://github.com/pie-framework/pie-elements/issues/136)) ([184f262](https://github.com/pie-framework/pie-elements/commit/184f262))





## [3.2.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.2.1...@pie-element/function-entry@3.2.2) (2019-02-20)

**Note:** Version bump only for package @pie-element/function-entry





## [3.2.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.1.1...@pie-element/function-entry@3.2.1) (2019-02-13)

**Note:** Version bump only for package @pie-element/function-entry





## [3.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.0.5...@pie-element/function-entry@3.1.1) (2019-02-13)

**Note:** Version bump only for package @pie-element/function-entry





## [3.0.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.0.4...@pie-element/function-entry@3.0.5) (2019-02-13)

**Note:** Version bump only for package @pie-element/function-entry





## [3.0.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.0.3...@pie-element/function-entry@3.0.4) (2019-01-08)


### Bug Fixes

* **general:** bumped the config-ui version for all packages ([159521d](https://github.com/pie-framework/pie-elements/commit/159521d))





<a name="3.0.3"></a>
## [3.0.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.0.2...@pie-element/function-entry@3.0.3) (2018-09-20)


### Bug Fixes

* build fixes ([3c3a7f2](https://github.com/pie-framework/pie-elements/commit/3c3a7f2))





<a name="3.0.2"></a>
## [3.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@3.0.1...@pie-element/function-entry@3.0.2) (2018-08-06)


### Bug Fixes

* bump config-ui@^7.6.6 ([266235a](https://github.com/pie-framework/pie-elements/commit/266235a))




      <a name="3.0.1"></a>
## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@2.1.0...@pie-element/function-entry@3.0.1) (2018-05-25)




**Note:** Version bump only for package @pie-element/function-entry

    <a name="2.1.0"></a>
# [2.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@2.0.0...@pie-element/function-entry@2.1.0) (2018-05-22)


### Features

* upgrade material-ui -> [@material-ui](https://github.com/material-ui)/core@1.0.0-rc.1 ([12b45c7](https://github.com/pie-framework/pie-elements/commit/12b45c7))




  <a name="2.0.0"></a>
# [2.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@1.7.0...@pie-element/function-entry@2.0.0) (2018-05-11)


### Bug Fixes

* **controller:** bump feedback version ([a07c9ec](https://github.com/pie-framework/pie-elements/commit/a07c9ec))
* **dependecies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([4be839f](https://github.com/pie-framework/pie-elements/commit/4be839f))
* **dependencies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([6fea7bb](https://github.com/pie-framework/pie-elements/commit/6fea7bb))


### Features

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




<a name="1.7.0"></a>
# [1.7.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/function-entry@1.6.0...@pie-element/function-entry@1.7.0) (2018-05-03)


### Features

* **dependencies:** use latest of [@pie-ui](https://github.com/pie-ui)/* ([ac9d2e5](https://github.com/pie-framework/pie-elements/commit/ac9d2e5))




<a name="1.6.0"></a>
# 1.6.0 (2018-04-25)


### Bug Fixes

* **package:** add repository ([2b5a593](https://github.com/pie-framework/pie-elements/commit/2b5a593))



<a name="1.5.0"></a>
# 1.5.0 (2018-04-17)



<a name="1.4.1"></a>
## 1.4.1 (2018-04-17)



<a name="1.4.0"></a>
# 1.4.0 (2018-04-17)


### Features

* **dependencies:** use latest dependencies ([5220ea2](https://github.com/pie-framework/pie-elements/commit/5220ea2))
* **function-entry:** add mathjs to function entry ([25ab268](https://github.com/pie-framework/pie-elements/commit/25ab268))
* **function-entry:** added function entry ([5523192](https://github.com/pie-framework/pie-elements/commit/5523192))
* **function-entry:** added hints popover ([3a6cfd3](https://github.com/pie-framework/pie-elements/commit/3a6cfd3))
* **function-entry:** feedback and peer fixes, mathjs comparison fix ([f62ec87](https://github.com/pie-framework/pie-elements/commit/f62ec87))
* **function-entry:** finalized for publish ([25236e3](https://github.com/pie-framework/pie-elements/commit/25236e3))
* **function-entry:** finalized function-entry component ([6911a86](https://github.com/pie-framework/pie-elements/commit/6911a86))
* **function-entry:** getting ready for publish, final version ([972518a](https://github.com/pie-framework/pie-elements/commit/972518a))
* **function-entry:** hints popover fixes and adjustments ([8926f7b](https://github.com/pie-framework/pie-elements/commit/8926f7b))




<a name="1.5.0"></a>
# [1.5.0](https://github.com/pie-framework/pie-elements/compare/v1.4.1...v1.5.0) (2018-04-17)




**Note:** Version bump only for package @pie-element/function-entry

<a name="1.4.1"></a>
## [1.4.1](https://github.com/pie-framework/pie-elements/compare/v1.4.0...v1.4.1) (2018-04-17)




**Note:** Version bump only for package @pie-element/function-entry

<a name="1.4.0"></a>
# [1.4.0](https://github.com/pie-framework/pie-elements/compare/v1.3.0...v1.4.0) (2018-04-17)


### Features

* **dependencies:** use latest dependencies ([5220ea2](https://github.com/pie-framework/pie-elements/commit/5220ea2))
* **function-entry:** add mathjs to function entry ([25ab268](https://github.com/pie-framework/pie-elements/commit/25ab268))
* **function-entry:** added function entry ([5523192](https://github.com/pie-framework/pie-elements/commit/5523192))
* **function-entry:** added hints popover ([3a6cfd3](https://github.com/pie-framework/pie-elements/commit/3a6cfd3))
* **function-entry:** feedback and peer fixes, mathjs comparison fix ([f62ec87](https://github.com/pie-framework/pie-elements/commit/f62ec87))
* **function-entry:** finalized for publish ([25236e3](https://github.com/pie-framework/pie-elements/commit/25236e3))
* **function-entry:** finalized function-entry component ([6911a86](https://github.com/pie-framework/pie-elements/commit/6911a86))
* **function-entry:** getting ready for publish, final version ([972518a](https://github.com/pie-framework/pie-elements/commit/972518a))
* **function-entry:** hints popover fixes and adjustments ([8926f7b](https://github.com/pie-framework/pie-elements/commit/8926f7b))
