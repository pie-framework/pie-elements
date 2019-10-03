# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@3.1.0...@pie-element/ebsr-controller@3.1.1) (2019-10-03)

**Note:** Version bump only for package @pie-element/ebsr-controller





# [3.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@3.0.2...@pie-element/ebsr-controller@3.1.0) (2019-09-27)


### Features

* **ebsr:** model based prompt ([b538d4e](https://github.com/pie-framework/pie-elements/commit/b538d4e))





## [3.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@3.0.1...@pie-element/ebsr-controller@3.0.2) (2019-09-25)

**Note:** Version bump only for package @pie-element/ebsr-controller





## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@3.0.0...@pie-element/ebsr-controller@3.0.1) (2019-09-25)


### Bug Fixes

* Do not use e.update if it is not defined. Added feedbackEnabled property on model. ([f4c6111](https://github.com/pie-framework/pie-elements/commit/f4c6111))





# [3.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@2.0.3...@pie-element/ebsr-controller@3.0.0) (2019-09-19)


* Moved rationale, teacherInstructions and studentInstructions enabled flag in model because it's needed in controller. ([c0c58e3](https://github.com/pie-framework/pie-elements/commit/c0c58e3))


### BREAKING CHANGES

* `enabled` property from `configuration.rationale.enabled` moved to `model.rationaleEnabled`. Same applies to teacherInstructions/studentInstructions.





## [2.0.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@2.0.2...@pie-element/ebsr-controller@2.0.3) (2019-09-17)

**Note:** Version bump only for package @pie-element/ebsr-controller





## [2.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@2.0.1...@pie-element/ebsr-controller@2.0.2) (2019-09-16)


### Bug Fixes

* Shuffle choices only when sending them to pie-ui. ([e3240fb](https://github.com/pie-framework/pie-elements/commit/e3240fb))





## [2.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@2.0.0...@pie-element/ebsr-controller@2.0.1) (2019-09-13)

**Note:** Version bump only for package @pie-element/ebsr-controller





# [2.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.5.1...@pie-element/ebsr-controller@2.0.0) (2019-09-13)


### Bug Fixes

* teacher instructions should be sent only for instructor ([977b80b](https://github.com/pie-framework/pie-elements/commit/977b80b))


### Features

* Separated the model and the configuration values in 3 categories: for partA, for partB and for both. ([36079dd](https://github.com/pie-framework/pie-elements/commit/36079dd))


### BREAKING CHANGES

* `config` will contain `partA`, `partB` and global settings. `config.partA` and `config.partB` will contain individual settings. Same applies to `model`.





## [1.5.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.5.0...@pie-element/ebsr-controller@1.5.1) (2019-09-05)

**Note:** Version bump only for package @pie-element/ebsr-controller





# [1.5.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.4.0...@pie-element/ebsr-controller@1.5.0) (2019-09-04)


### Bug Fixes

* bump pie-lib/controller-utils ([ba3de00](https://github.com/pie-framework/pie-elements/commit/ba3de00))


### Features

* make use of updateSession callback ([764c50f](https://github.com/pie-framework/pie-elements/commit/764c50f))





# [1.4.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.3.7...@pie-element/ebsr-controller@1.4.0) (2019-08-27)


### Features

* return max in 'outcome' ([1a006fa](https://github.com/pie-framework/pie-elements/commit/1a006fa))
* Session null/empty check ([0538211](https://github.com/pie-framework/pie-elements/commit/0538211))





## [1.3.7](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.3.6...@pie-element/ebsr-controller@1.3.7) (2019-08-15)

**Note:** Version bump only for package @pie-element/ebsr-controller





## [1.3.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.3.5...@pie-element/ebsr-controller@1.3.6) (2019-08-02)

**Note:** Version bump only for package @pie-element/ebsr-controller





## [1.3.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.3.4...@pie-element/ebsr-controller@1.3.5) (2019-07-19)

**Note:** Version bump only for package @pie-element/ebsr-controller





## [1.3.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.3.3...@pie-element/ebsr-controller@1.3.4) (2019-07-17)


### Bug Fixes

* **template-areas:** fixed ebsr not disabling issue in controller when it should [ch2192] ([b43fa51](https://github.com/pie-framework/pie-elements/commit/b43fa51))
* **template-areas:** fixed ebsr not disabling issue in controller when it should [ch2192] ([6195b95](https://github.com/pie-framework/pie-elements/commit/6195b95))





## [1.3.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.3.2...@pie-element/ebsr-controller@1.3.3) (2019-07-11)

**Note:** Version bump only for package @pie-element/ebsr-controller





## [1.3.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.3.1...@pie-element/ebsr-controller@1.3.2) (2019-07-09)

**Note:** Version bump only for package @pie-element/ebsr-controller





## [1.3.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.3.0...@pie-element/ebsr-controller@1.3.1) (2019-05-23)

**Note:** Version bump only for package @pie-element/ebsr-controller





# [1.3.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.2.2...@pie-element/ebsr-controller@1.3.0) (2019-05-21)


### Features

* added rationale support. ([3311b33](https://github.com/pie-framework/pie-elements/commit/3311b33))





## [1.2.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.2.1...@pie-element/ebsr-controller@1.2.2) (2019-04-23)

**Note:** Version bump only for package @pie-element/ebsr-controller





## [1.2.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.2.0...@pie-element/ebsr-controller@1.2.1) (2019-04-12)

**Note:** Version bump only for package @pie-element/ebsr-controller





# [1.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.1.1...@pie-element/ebsr-controller@1.2.0) (2019-04-11)


### Features

* update scoring [ch1199] ([72b9803](https://github.com/pie-framework/pie-elements/commit/72b9803))





## [1.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/ebsr-controller@1.1.0...@pie-element/ebsr-controller@1.1.1) (2019-04-08)

**Note:** Version bump only for package @pie-element/ebsr-controller





# 1.1.0 (2019-04-04)


### Features

* allow config to control the UI ([70551b8](https://github.com/pie-framework/pie-elements/commit/70551b8))
* capture elements' model update events ([3e2fd10](https://github.com/pie-framework/pie-elements/commit/3e2fd10))
* implement default model initialization method ([c080d28](https://github.com/pie-framework/pie-elements/commit/c080d28))
* implement outcome ([dc29e82](https://github.com/pie-framework/pie-elements/commit/dc29e82))
* integrate unit tests ([293710f](https://github.com/pie-framework/pie-elements/commit/293710f))
* stub ebsr pie element ([87b7feb](https://github.com/pie-framework/pie-elements/commit/87b7feb))
* use multiple-choice pie element as a dependency instead ([f0b8efd](https://github.com/pie-framework/pie-elements/commit/f0b8efd))
