# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@5.0.1...@pie-element/math-inline-controller@5.0.2) (2019-10-15)


### Bug Fixes

* bump @pie-lib/controller-utils@^0.2.2 ([edae61c](https://github.com/pie-framework/pie-elements/commit/edae61c))





## [5.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@5.0.0...@pie-element/math-inline-controller@5.0.1) (2019-10-11)


### Bug Fixes

* bump @pie-lib/controller-utils@^0.2.1 [ch4723] ([0a33d68](https://github.com/pie-framework/pie-elements/commit/0a33d68))





# [5.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@4.1.4...@pie-element/math-inline-controller@5.0.0) (2019-10-08)


* Andreea/ch3969/for all items default values should be true (#355) ([9916c38](https://github.com/pie-framework/pie-elements/commit/9916c38)), closes [#355](https://github.com/pie-framework/pie-elements/issues/355)


### Bug Fixes

* **math-inline:** fix controller logic safety net - ch3905 ([#356](https://github.com/pie-framework/pie-elements/issues/356)) ([bcd5272](https://github.com/pie-framework/pie-elements/commit/bcd5272))
* **math-inline:** fix symbolic evaluation with text nodes - ch4709 ([6aea32b](https://github.com/pie-framework/pie-elements/commit/6aea32b))


### BREAKING CHANGES

* allowFeedback was replaced with feedbackEnabled.

* fix(charting): Set feedbackEnabled, rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(drag-in-the-blank): Set rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(drawing-response): Set rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(ebsr): Set feedbackEnabled, rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(explicit-constructed-response): Set rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(extended-text-entry): Set feedbackEnabled, rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(graph-lines): Set rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(graphing): Set rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(hotspot): Set rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(image-cloze-association): Set rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(inline-dropdown): Set rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(match): replaced usage of allowFeedback with feedbackEnabled.  Set feedbackEnabled, rationaleEnabled, teacherInstructions, studentInstructions value on true by default.
* allowFeedback was replaced with feedbackEnabled. `configuration.feedback.enabled` was moved to `model.feedbackEnabled`.

* fix(math-inline): Set feedbackEnabled, rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(multiple-choice): Set feedbackEnabled, rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(placement-ordering): replaced usage of allowFeedback with feedbackEnabled.  Set feedbackEnabled, rationaleEnabled, teacherInstructions, studentInstructions value on true by default.
* allowFeedback was replaced with feedbackEnabled. `configuration.feedback.enabled` was moved to `model.feedbackEnabled`.

* fix(select-text): Set feedbackEnabled, rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix(text-entry): Set rationaleEnabled, teacherInstructions, studentInstructions value on true by default.

* fix: Updated pie-models.

* fix(categorize): Added normalize function on controller (to be able to add default values to the model).

* fix(charting): Added normalize function on controller (to be able to add default values to the model).

* fix(drag-in-the-blank): Added normalize function on controller (to be able to add default values to the model).

* fix(drawing-response): Added normalize function on controller (to be able to add default values to the model).

* fix(ebsr): Added normalize function on controller (to be able to add default values to the model).

* fix(explicit-constructed-response): Added normalize function on controller (to be able to add default values to the model).

* fix(extended-text-entry): Added normalize function on controller (to be able to add default values to the model).

* Remove unnecessary change.

* fix(graph-lines): Added normalize function on controller (to be able to add default values to the model).

* fix(graphing): Added normalize function on controller (to be able to add default values to the model).

* fix(hotspot): Added normalize function on controller (to be able to add default values to the model).

* fix(image-cloze-association): Added normalize function on controller (to be able to add default values to the model).

* fix(inline-dropdown): Added normalize function on controller (to be able to add default values to the model).

* fix(match): Added normalize function on controller (to be able to add default values to the model).

* fix(math-inline): Added normalize function on controller (to be able to add default values to the model).

* fix(multiple-choice): Added normalize function on controller (to be able to add default values to the model).

* fix(placement-ordering): Added normalize function on controller (to be able to add default values to the model).

* fix(select-text): Added normalize function on controller (to be able to add default values to the model).

* fix(text-entry): Added normalize function on controller (to be able to add default values to the model).





## [4.1.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@4.1.3...@pie-element/math-inline-controller@4.1.4) (2019-10-04)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [4.1.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@4.1.2...@pie-element/math-inline-controller@4.1.3) (2019-10-03)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [4.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@4.1.1...@pie-element/math-inline-controller@4.1.2) (2019-10-03)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [4.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@4.1.0...@pie-element/math-inline-controller@4.1.1) (2019-10-03)


### Bug Fixes

* **math-inline:** cdot and times equivalence in evaluation fix ([#348](https://github.com/pie-framework/pie-elements/issues/348)) ([fb75a46](https://github.com/pie-framework/pie-elements/commit/fb75a46))
* **math-inline:** simple mode literal evaluation fix for decimals and spaces ([#349](https://github.com/pie-framework/pie-elements/issues/349)) ([5844d9f](https://github.com/pie-framework/pie-elements/commit/5844d9f))





# [4.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@4.0.0...@pie-element/math-inline-controller@4.1.0) (2019-09-27)


### Bug Fixes

* added feedbackEnabled property to model, removed usage on config.feedback.enabled and removed usage of allowFeedback (replaced with feedbackEnabled). ([c47fb9a](https://github.com/pie-framework/pie-elements/commit/c47fb9a))


### Features

* **math-inline:** model based prompt ([d7910e3](https://github.com/pie-framework/pie-elements/commit/d7910e3))





# [4.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@3.1.1...@pie-element/math-inline-controller@4.0.0) (2019-09-17)


* Moved rationale, teacherInstructions and studentInstructions enabled flag in model because it's needed in controller. ([07b7da9](https://github.com/pie-framework/pie-elements/commit/07b7da9))


### BREAKING CHANGES

* `enabled` property from `configuration.rationale.enabled` moved to `model.rationaleEnabled`. Same applies to teacherInstructions/studentInstructions.





## [3.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@3.1.0...@pie-element/math-inline-controller@3.1.1) (2019-09-04)

**Note:** Version bump only for package @pie-element/math-inline-controller





# [3.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@3.0.1...@pie-element/math-inline-controller@3.1.0) (2019-08-27)


### Features

* Session null/empty check. ([f24dc8b](https://github.com/pie-framework/pie-elements/commit/f24dc8b))





## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@3.0.0...@pie-element/math-inline-controller@3.0.1) (2019-08-26)


### Bug Fixes

* **math-inline:** text nodes should not matter in literal evaluation ([a7e574a](https://github.com/pie-framework/pie-elements/commit/a7e574a))





# [3.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.3.9...@pie-element/math-inline-controller@3.0.0) (2019-08-21)


### Bug Fixes

* Fixed Add Alternate when default alternates were defined. Send 'response' if response type is 'simple', send 'responses' if response type is 'advance multi' to ui. ([609a0d7](https://github.com/pie-framework/pie-elements/commit/609a0d7))
* Removed unnecessary response property from the model. ([b0a0f3d](https://github.com/pie-framework/pie-elements/commit/b0a0f3d))


### BREAKING CHANGES

* `response` was removed from model, use responses instead.





## [2.3.9](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.3.8...@pie-element/math-inline-controller@2.3.9) (2019-08-15)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [2.3.8](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.3.7...@pie-element/math-inline-controller@2.3.8) (2019-08-02)


### Bug Fixes

* **math-inline:** controller outcome function output adjusted to 0-1 ([1897473](https://github.com/pie-framework/pie-elements/commit/1897473))





## [2.3.7](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.3.6...@pie-element/math-inline-controller@2.3.7) (2019-07-25)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [2.3.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.3.5...@pie-element/math-inline-controller@2.3.6) (2019-07-25)


### Bug Fixes

* **math-inline:** hyphen and minus sign should be equivalent in literal validation ([c4e788f](https://github.com/pie-framework/pie-elements/commit/c4e788f))





## [2.3.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.3.4...@pie-element/math-inline-controller@2.3.5) (2019-07-07)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [2.3.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.3.3...@pie-element/math-inline-controller@2.3.4) (2019-07-07)


### Bug Fixes

* **editable-html:** fixed lots of stuff regarding the editable-html ([12c1129](https://github.com/pie-framework/pie-elements/commit/12c1129))





## [2.3.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.3.2...@pie-element/math-inline-controller@2.3.3) (2019-07-05)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [2.3.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.3.1...@pie-element/math-inline-controller@2.3.2) (2019-07-03)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [2.3.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.3.0...@pie-element/math-inline-controller@2.3.1) (2019-07-02)

**Note:** Version bump only for package @pie-element/math-inline-controller





# [2.3.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.2.4...@pie-element/math-inline-controller@2.3.0) (2019-07-02)


### Bug Fixes

* **math-inline:** interaction fixes, controller logic adjustment and small styling changes ([40a1dc1](https://github.com/pie-framework/pie-elements/commit/40a1dc1))


### Features

* **math-inline:** allowing decimals in response is valid for literal validation too ([4c17840](https://github.com/pie-framework/pie-elements/commit/4c17840))





## [2.2.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.2.3...@pie-element/math-inline-controller@2.2.4) (2019-06-20)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [2.2.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.2.2...@pie-element/math-inline-controller@2.2.3) (2019-06-18)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [2.2.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.2.1...@pie-element/math-inline-controller@2.2.2) (2019-06-17)


### Bug Fixes

* **math-inline:** validation logic fix for allowSpaces ([2951657](https://github.com/pie-framework/pie-elements/commit/2951657))





## [2.2.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.2.0...@pie-element/math-inline-controller@2.2.1) (2019-05-31)

**Note:** Version bump only for package @pie-element/math-inline-controller





# [2.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.1.3...@pie-element/math-inline-controller@2.2.0) (2019-05-24)


### Features

* **math-inline:** add outcome function to controller ([ce6b1bb](https://github.com/pie-framework/pie-elements/commit/ce6b1bb))





## [2.1.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.1.2...@pie-element/math-inline-controller@2.1.3) (2019-05-23)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [2.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.1.1...@pie-element/math-inline-controller@2.1.2) (2019-05-21)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [2.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.1.0...@pie-element/math-inline-controller@2.1.1) (2019-05-16)

**Note:** Version bump only for package @pie-element/math-inline-controller





# [2.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.0.3...@pie-element/math-inline-controller@2.1.0) (2019-05-14)


### Features

* Sending rationale for `instructor` mode. ([e297e50](https://github.com/pie-framework/pie-elements/commit/e297e50))
* Sending rationale for `instructor` role only in 'view' or 'evaluate' mode. ([75c941c](https://github.com/pie-framework/pie-elements/commit/75c941c))
* **math-inline:** added rationale support. ([7a4f9d4](https://github.com/pie-framework/pie-elements/commit/7a4f9d4))





## [2.0.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.0.2...@pie-element/math-inline-controller@2.0.3) (2019-05-08)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [2.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.0.1...@pie-element/math-inline-controller@2.0.2) (2019-05-07)

**Note:** Version bump only for package @pie-element/math-inline-controller





## [2.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-controller@2.0.0...@pie-element/math-inline-controller@2.0.1) (2019-04-23)

**Note:** Version bump only for package @pie-element/math-inline-controller





# 2.0.0 (2019-04-23)


### Bug Fixes

* **math-inline:** centralized variables for interaction modes ([5afa51a](https://github.com/pie-framework/pie-elements/commit/5afa51a))
* minor adjustments ([2865349](https://github.com/pie-framework/pie-elements/commit/2865349))
* **math-inline:** config and controller package names ([e477d10](https://github.com/pie-framework/pie-elements/commit/e477d10))
* **math-inline:** fix simple mode interaction and remove defaultResponse from model ([cc82516](https://github.com/pie-framework/pie-elements/commit/cc82516))
* **math-inline:** initial placeholder tests and fixes ([a49fe1b](https://github.com/pie-framework/pie-elements/commit/a49fe1b))
* **math-inline:** initial placeholder tests and fixes ([1644b94](https://github.com/pie-framework/pie-elements/commit/1644b94))


### Features

* **general:** initialize default model ([#129](https://github.com/pie-framework/pie-elements/issues/129)) ([b62d058](https://github.com/pie-framework/pie-elements/commit/b62d058))
* **math-inline:** answer block generation related functionality ([045173e](https://github.com/pie-framework/pie-elements/commit/045173e))
* **math-inline:** config panel and controller done for initial release ([f8d4ed8](https://github.com/pie-framework/pie-elements/commit/f8d4ed8))
* **math-inline:** decimal support and partial scoring ([84b1292](https://github.com/pie-framework/pie-elements/commit/84b1292))
* **math-inline:** finalize for first release ([e33b3ad](https://github.com/pie-framework/pie-elements/commit/e33b3ad))
* **math-inline:** formulaV2 support for controller and relevant config panel adjustments ([168f0d5](https://github.com/pie-framework/pie-elements/commit/168f0d5))
* **math-inline:** Integrated settings panel. ([4d6c9dd](https://github.com/pie-framework/pie-elements/commit/4d6c9dd))


### BREAKING CHANGES

* **math-inline:** controller validation schema is now using formulaV2 approach, resulting interface is changed and partial scoring is no longer supported





# [1.5.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.4.1...@pie-element/match-inline-controller@1.5.0) (2019-04-19)


### Features

* **math-inline:** Integrated settings panel. ([4d6c9dd](https://github.com/pie-framework/pie-elements/commit/4d6c9dd))





## [1.4.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.4.0...@pie-element/match-inline-controller@1.4.1) (2019-04-12)

**Note:** Version bump only for package @pie-element/match-inline-controller





# [1.4.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.3.7...@pie-element/match-inline-controller@1.4.0) (2019-04-11)


### Bug Fixes

* minor adjustments ([2865349](https://github.com/pie-framework/pie-elements/commit/2865349))


### Features

* **math-inline:** decimal support and partial scoring ([84b1292](https://github.com/pie-framework/pie-elements/commit/84b1292))





## [1.3.7](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.3.6...@pie-element/match-inline-controller@1.3.7) (2019-04-08)

**Note:** Version bump only for package @pie-element/match-inline-controller





## [1.3.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.3.5...@pie-element/match-inline-controller@1.3.6) (2019-03-26)

**Note:** Version bump only for package @pie-element/match-inline-controller





## [1.3.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.3.4...@pie-element/match-inline-controller@1.3.5) (2019-03-19)


### Bug Fixes

* **math-inline:** fix simple mode interaction and remove defaultResponse from model ([cc82516](https://github.com/pie-framework/pie-elements/commit/cc82516))





## [1.3.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.3.3...@pie-element/match-inline-controller@1.3.4) (2019-03-18)

**Note:** Version bump only for package @pie-element/match-inline-controller





## [1.3.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.3.2...@pie-element/match-inline-controller@1.3.3) (2019-03-18)

**Note:** Version bump only for package @pie-element/match-inline-controller





## [1.3.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.3.1...@pie-element/match-inline-controller@1.3.2) (2019-03-18)

**Note:** Version bump only for package @pie-element/match-inline-controller





## [1.3.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.3.0...@pie-element/match-inline-controller@1.3.1) (2019-03-18)

**Note:** Version bump only for package @pie-element/match-inline-controller





# [1.3.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.2.2...@pie-element/match-inline-controller@1.3.0) (2019-03-13)


### Features

* **general:** initialize default model ([#129](https://github.com/pie-framework/pie-elements/issues/129)) ([b62d058](https://github.com/pie-framework/pie-elements/commit/b62d058))





## [1.2.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.2.1...@pie-element/match-inline-controller@1.2.2) (2019-02-20)

**Note:** Version bump only for package @pie-element/match-inline-controller





## [1.2.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.2.0...@pie-element/match-inline-controller@1.2.1) (2019-02-13)

**Note:** Version bump only for package @pie-element/match-inline-controller





# [1.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/match-inline-controller@1.1.3...@pie-element/match-inline-controller@1.2.0) (2019-02-13)


### Features

* **math-inline:** answer block generation related functionality ([045173e](https://github.com/pie-framework/pie-elements/commit/045173e))
* **math-inline:** config panel and controller done for initial release ([f8d4ed8](https://github.com/pie-framework/pie-elements/commit/f8d4ed8))
* **math-inline:** finalize for first release ([e33b3ad](https://github.com/pie-framework/pie-elements/commit/e33b3ad))





## 1.1.3 (2018-11-26)


### Bug Fixes

* **math-inline:** config and controller package names ([e477d10](https://github.com/pie-framework/pie-elements/commit/e477d10))
* **math-inline:** initial placeholder tests and fixes ([a49fe1b](https://github.com/pie-framework/pie-elements/commit/a49fe1b))
* **math-inline:** initial placeholder tests and fixes ([1644b94](https://github.com/pie-framework/pie-elements/commit/1644b94))
