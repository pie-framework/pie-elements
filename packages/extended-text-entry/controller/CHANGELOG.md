# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@3.1.2...@pie-element/extended-text-entry-controller@4.0.0) (2019-10-08)


* Andreea/ch3969/for all items default values should be true (#355) ([9916c38](https://github.com/pie-framework/pie-elements/commit/9916c38)), closes [#355](https://github.com/pie-framework/pie-elements/issues/355)


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





## [3.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@3.1.1...@pie-element/extended-text-entry-controller@3.1.2) (2019-10-03)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





## [3.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@3.1.0...@pie-element/extended-text-entry-controller@3.1.1) (2019-10-03)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





# [3.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@3.0.1...@pie-element/extended-text-entry-controller@3.1.0) (2019-09-27)


### Bug Fixes

* added feedbackEnabled property to model, removed usage on config.feedback.enabled and removed usage of allowFeedback (replaced with feedbackEnabled). ([839aa3c](https://github.com/pie-framework/pie-elements/commit/839aa3c))


### Features

* **extended-text-entry:** model based prompt ([f399425](https://github.com/pie-framework/pie-elements/commit/f399425))





## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@3.0.0...@pie-element/extended-text-entry-controller@3.0.1) (2019-09-19)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





# [3.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.3.3...@pie-element/extended-text-entry-controller@3.0.0) (2019-09-17)


### Features

* Moved rationale, teacherInstructions and student instructions enabled flag in model because it's needed in controller. ([9238954](https://github.com/pie-framework/pie-elements/commit/9238954))


### BREAKING CHANGES

* `enabled` property from `configuration.rationale.enabled` moved to `model.rationaleEnabled`. Same applies to teacherInstructions/studentInstructions.





## [2.3.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.3.2...@pie-element/extended-text-entry-controller@2.3.3) (2019-08-27)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





## [2.3.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.3.1...@pie-element/extended-text-entry-controller@2.3.2) (2019-08-26)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





## [2.3.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.3.0...@pie-element/extended-text-entry-controller@2.3.1) (2019-07-11)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





# [2.3.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.2.5...@pie-element/extended-text-entry-controller@2.3.0) (2019-07-09)


### Features

* Added a dropdown in settings panel with Equation Editor Types if mathInput is true. ([324c3d9](https://github.com/pie-framework/pie-elements/commit/324c3d9))
* Used mathInput value in order to hide/display math option in pie-ui/extended-text-entry. Moved width & height to settings panel. Added a dropdown in settings panel with Equation Editor Types if mathInput is true (functionality for it is WIP). Updated pie-models, pie-schemas & tests. ([fd65b22](https://github.com/pie-framework/pie-elements/commit/fd65b22))





## [2.2.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.2.4...@pie-element/extended-text-entry-controller@2.2.5) (2019-07-07)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





## [2.2.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.2.3...@pie-element/extended-text-entry-controller@2.2.4) (2019-07-07)


### Bug Fixes

* **editable-html:** fixed lots of stuff regarding the editable-html ([12c1129](https://github.com/pie-framework/pie-elements/commit/12c1129))





## [2.2.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.2.2...@pie-element/extended-text-entry-controller@2.2.3) (2019-07-05)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





## [2.2.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.2.1...@pie-element/extended-text-entry-controller@2.2.2) (2019-07-03)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





## [2.2.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.2.0...@pie-element/extended-text-entry-controller@2.2.1) (2019-04-23)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





# [2.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.1.7...@pie-element/extended-text-entry-controller@2.2.0) (2019-04-23)


### Features

* **extended-text-entry:** Updated model structure with new established structure, integrated settings panel and updated tests. ([cdb29e4](https://github.com/pie-framework/pie-elements/commit/cdb29e4))





## [2.1.7](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.1.6...@pie-element/extended-text-entry-controller@2.1.7) (2019-04-08)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





## [2.1.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.1.5...@pie-element/extended-text-entry-controller@2.1.6) (2019-04-04)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





## [2.1.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.1.4...@pie-element/extended-text-entry-controller@2.1.5) (2019-03-26)


### Bug Fixes

* **extended-text-entry:** fixed updating dimensions (width & height). ([5f16e2a](https://github.com/pie-framework/pie-elements/commit/5f16e2a))





## [2.1.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.1.3...@pie-element/extended-text-entry-controller@2.1.4) (2019-03-18)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





## [2.1.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.1.2...@pie-element/extended-text-entry-controller@2.1.3) (2019-03-18)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





## [2.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.1.1...@pie-element/extended-text-entry-controller@2.1.2) (2019-03-18)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





## [2.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/extended-text-entry-controller@2.1.0...@pie-element/extended-text-entry-controller@2.1.1) (2019-03-18)

**Note:** Version bump only for package @pie-element/extended-text-entry-controller





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

* add outcome method to extended text-entry ([c92c41d](https://github.com/pie-framework/pie-elements/commit/c92c41d))
* **extended-text-entry:** added prompt to model and display ([9b3a530](https://github.com/pie-framework/pie-elements/commit/9b3a530))
* **feedback:** Use new feedback model ([326f9b2](https://github.com/pie-framework/pie-elements/commit/326f9b2))
* **model:** discard legacy model - use streamlined model. ([ed47b59](https://github.com/pie-framework/pie-elements/commit/ed47b59))
* **ui:** finalise config ui ([75bd395](https://github.com/pie-framework/pie-elements/commit/75bd395))


### BREAKING CHANGES

* **feedback:** Feedback is now of the form: `{type,default?, custom?}`
* **model:** The old corespring model is no longer supported.
