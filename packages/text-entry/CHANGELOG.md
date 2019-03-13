# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.4.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@3.3.2...@pie-element/text-entry@3.4.0) (2019-03-13)


### Features

* **general:** initialize default model ([#129](https://github.com/pie-framework/pie-elements/issues/129)) ([b62d058](https://github.com/pie-framework/pie-elements/commit/b62d058))
* all elements on `develop` target [@next](https://github.com/next) releases ([d3766e6](https://github.com/pie-framework/pie-elements/commit/d3766e6))
* update schema docs ([#136](https://github.com/pie-framework/pie-elements/issues/136)) ([184f262](https://github.com/pie-framework/pie-elements/commit/184f262))





## [3.3.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@3.3.1...@pie-element/text-entry@3.3.2) (2019-02-20)

**Note:** Version bump only for package @pie-element/text-entry





## [3.3.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@3.2.1...@pie-element/text-entry@3.3.1) (2019-02-13)

**Note:** Version bump only for package @pie-element/text-entry





## [3.2.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@3.1.5...@pie-element/text-entry@3.2.1) (2019-02-13)

**Note:** Version bump only for package @pie-element/text-entry





## [3.1.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@3.1.4...@pie-element/text-entry@3.1.5) (2019-02-13)

**Note:** Version bump only for package @pie-element/text-entry





## [3.1.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@3.1.2...@pie-element/text-entry@3.1.4) (2019-02-08)

**Note:** Version bump only for package @pie-element/text-entry





## [3.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@3.1.1...@pie-element/text-entry@3.1.2) (2019-01-08)


### Bug Fixes

* **general:** bumped the config-ui version for all packages ([159521d](https://github.com/pie-framework/pie-elements/commit/159521d))





<a name="3.1.1"></a>
## [3.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@3.1.0...@pie-element/text-entry@3.1.1) (2018-09-20)


### Bug Fixes

* build fixes ([3c3a7f2](https://github.com/pie-framework/pie-elements/commit/3c3a7f2))





<a name="3.1.0"></a>
# [3.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@3.0.3...@pie-element/text-entry@3.1.0) (2018-09-11)


### Bug Fixes

* bump ui dependency ([da39d3d](https://github.com/pie-framework/pie-elements/commit/da39d3d))


### Features

* **text-entry:** added prompt property ([10a6646](https://github.com/pie-framework/pie-elements/commit/10a6646))




      <a name="3.0.3"></a>
## [3.0.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@3.0.2...@pie-element/text-entry@3.0.3) (2018-09-07)




**Note:** Version bump only for package @pie-element/text-entry

    <a name="3.0.2"></a>
## [3.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@3.0.1...@pie-element/text-entry@3.0.2) (2018-08-06)


### Bug Fixes

* bump config-ui@^7.6.6 ([266235a](https://github.com/pie-framework/pie-elements/commit/266235a))




  <a name="3.0.1"></a>
## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@2.1.0...@pie-element/text-entry@3.0.1) (2018-05-25)




**Note:** Version bump only for package @pie-element/text-entry

<a name="2.1.0"></a>
# [2.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@2.0.0...@pie-element/text-entry@2.1.0) (2018-05-22)


### Features

* upgrade material-ui -> [@material-ui](https://github.com/material-ui)/core@1.0.0-rc.1 ([1e38e50](https://github.com/pie-framework/pie-elements/commit/1e38e50))




<a name="2.0.0"></a>
# [2.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@1.7.0...@pie-element/text-entry@2.0.0) (2018-05-11)


### Bug Fixes

* **dependecies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([4be839f](https://github.com/pie-framework/pie-elements/commit/4be839f))
* **dependencies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([6fea7bb](https://github.com/pie-framework/pie-elements/commit/6fea7bb))


### Features

* **model:** move away from old model ([4763668](https://github.com/pie-framework/pie-elements/commit/4763668))


### BREAKING CHANGES

* **model:** * Feedback now uses the new model
* `model` is gone, properties moved up a level.

Full example:

From:
```javascript

{
id: '1',
element: 'text-entry',
correctResponses: {
values: ['mutt', 'hound'],
ignoreWhitespace: true,
ignoreCase: false,
feedback: {
type: 'custom',
value: 'correct-o'
}
},
partialResponses: {
values: ['mutty'],
ignoreWhitespace: true,
ignoreCase: true,
awardPercentage: '50',
feedback: {
type: 'custom',
value: 'foo'
}
},
incorrectFeedback: {
type: 'custom',
value: 'custom feedback'
},
model: {
answerBlankSize: '10',
answerAlignment: 'left',
allowDecimal: true,
allowIntegersOnly: false,
allowThousandsSeparator: true
}
}

```

To:
```javascript
{
id: '1',
element: 'text-entry',
feedback: {
correct: {
type: 'custom',
custom: 'correct-o'
},
incorrect: {
type: 'custom',
custom: 'custom feedback'
},
partial: {
type: 'custom',
custom: 'foo'
}
},
correctResponses: {
values: ['mutt', 'hound'],
ignoreWhitespace: true,
ignoreCase: false
},
partialResponses: {
values: ['mutty'],
ignoreWhitespace: true,
ignoreCase: true,
awardPercentage: '50'
},
answerBlankSize: '10',
answerAlignment: 'left',
allowDecimal: true,
allowIntegersOnly: false,
allowThousandsSeparator: true
}
```




<a name="1.7.0"></a>
# [1.7.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry@1.6.0...@pie-element/text-entry@1.7.0) (2018-05-03)


### Features

* **dependencies:** use latest of [@pie-ui](https://github.com/pie-ui)/* ([ac9d2e5](https://github.com/pie-framework/pie-elements/commit/ac9d2e5))




<a name="1.6.0"></a>
# 1.6.0 (2018-05-02)



<a name="1.5.0"></a>
# 1.5.0 (2018-04-17)


### Features

* **dependencie:** use latest [@pie-ui](https://github.com/pie-ui)/text-entry ([d6ef0cb](https://github.com/pie-framework/pie-elements/commit/d6ef0cb))



<a name="1.4.0"></a>
# 1.4.0 (2018-04-17)



<a name="1.2.2"></a>
## 1.2.2 (2018-03-06)


### Bug Fixes

* **dependencies:** fix dependencies ([46a2162](https://github.com/pie-framework/pie-elements/commit/46a2162))
* **dependencies:** fix dependencies ([136beff](https://github.com/pie-framework/pie-elements/commit/136beff))
* **dependencies:** update dependency names ([dc789ac](https://github.com/pie-framework/pie-elements/commit/dc789ac))




<a name="1.5.0"></a>
# [1.5.0](https://github.com/pie-framework/pie-elements/compare/v1.4.1...v1.5.0) (2018-04-17)


### Features

* **dependencie:** use latest [@pie-ui](https://github.com/pie-ui)/text-entry ([d6ef0cb](https://github.com/pie-framework/pie-elements/commit/d6ef0cb))




<a name="1.4.0"></a>
# [1.4.0](https://github.com/pie-framework/pie-elements/compare/v1.3.0...v1.4.0) (2018-04-17)




**Note:** Version bump only for package @pie-element/text-entry

<a name="1.2.2"></a>
## 1.2.2 (2018-03-06)


### Bug Fixes

* **dependencies:** fix dependencies ([46a2162](https://github.com/pie-framework/pie-elements/commit/46a2162))
* **dependencies:** fix dependencies ([136beff](https://github.com/pie-framework/pie-elements/commit/136beff))
* **dependencies:** update dependency names ([dc789ac](https://github.com/pie-framework/pie-elements/commit/dc789ac))




<a name="1.2.0"></a>
# [1.2.0](https://github.com/pie-framework/pie-elements/compare/v1.1.1...v1.2.0) (2018-03-01)


### Bug Fixes

* **deps:** use latest versions ([3b35ef1](https://github.com/pie-framework/pie-elements/commit/3b35ef1))
* **imports:** remove old imports ([e3d0bbb](https://github.com/pie-framework/pie-elements/commit/e3d0bbb))


### Features

* **deps:** bump dependencies ([fb60511](https://github.com/pie-framework/pie-elements/commit/fb60511))




<a name="1.1.1"></a>
## [1.1.1](https://github.com/pie-framework/pie-elements/compare/v1.1.0...v1.1.1) (2018-02-21)


### Bug Fixes

* **npm:** publishConfig.access = public ([e6fa1da](https://github.com/pie-framework/pie-elements/commit/e6fa1da))




<a name="1.1.0"></a>
# [1.1.0](https://github.com/pie-framework/pie-elements/compare/v1.0.2...v1.1.0) (2018-02-21)


### Bug Fixes

* **controller:** update tests ([3eda2d4](https://github.com/pie-framework/pie-elements/commit/3eda2d4))


### Features

* **configure:** add number input ([af36da1](https://github.com/pie-framework/pie-elements/commit/af36da1))
* **configure:** add percent award input and hook it up to model ([b74aee9](https://github.com/pie-framework/pie-elements/commit/b74aee9))
* **controller:** remove depedency on [@pie-ui](https://github.com/pie-elements)/text-entry-controller ([38604b1](https://github.com/pie-framework/pie-elements/commit/38604b1))
* **new:** new text entry package ([57c5c02](https://github.com/pie-framework/pie-elements/commit/57c5c02))
