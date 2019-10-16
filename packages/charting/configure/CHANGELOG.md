# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@2.0.0...@pie-element/charting-configure@2.0.1) (2019-10-15)


### Bug Fixes

* load session [ch4802] ([ef22948](https://github.com/pie-framework/pie-elements/commit/ef22948))





# [2.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@1.1.3...@pie-element/charting-configure@2.0.0) (2019-10-08)


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





## [1.1.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@1.1.2...@pie-element/charting-configure@1.1.3) (2019-10-04)

**Note:** Version bump only for package @pie-element/charting-configure





## [1.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@1.1.1...@pie-element/charting-configure@1.1.2) (2019-10-03)

**Note:** Version bump only for package @pie-element/charting-configure





## [1.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@1.1.0...@pie-element/charting-configure@1.1.1) (2019-10-03)

**Note:** Version bump only for package @pie-element/charting-configure





# [1.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@1.0.1...@pie-element/charting-configure@1.1.0) (2019-09-27)


### Features

* **charting:** model based prompt ([e648531](https://github.com/pie-framework/pie-elements/commit/e648531))





## [1.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@1.0.0...@pie-element/charting-configure@1.0.1) (2019-09-19)

**Note:** Version bump only for package @pie-element/charting-configure





# [1.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@0.1.5...@pie-element/charting-configure@1.0.0) (2019-09-17)


### Features

* Moved rationale, teacherInstructions and student instructions enabled flag in model because it's needed in controller. ([ddf464b](https://github.com/pie-framework/pie-elements/commit/ddf464b))


### BREAKING CHANGES

* `enabled` property from `configuration.rationale.enabled` moved to `model.rationaleEnabled`. Same applies to teacherInstructions/studentInstructions.





## [0.1.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@0.1.4...@pie-element/charting-configure@0.1.5) (2019-08-27)

**Note:** Version bump only for package @pie-element/charting-configure





## [0.1.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@0.1.3...@pie-element/charting-configure@0.1.4) (2019-08-26)

**Note:** Version bump only for package @pie-element/charting-configure





## [0.1.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@0.1.2...@pie-element/charting-configure@0.1.3) (2019-08-21)

**Note:** Version bump only for package @pie-element/charting-configure





## [0.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@0.1.1...@pie-element/charting-configure@0.1.2) (2019-08-21)


### Bug Fixes

* **math-rendering:** updated all dependent packages for math rendering and for editable-html [ch3365], [ch1530] ([33e3287](https://github.com/pie-framework/pie-elements/commit/33e3287))





## [0.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/charting-configure@0.1.0...@pie-element/charting-configure@0.1.1) (2019-08-18)


### Bug Fixes

* **math-rendering:** updated all dependent packages [ch3365] ([7cbf25a](https://github.com/pie-framework/pie-elements/commit/7cbf25a))
* set default values to configuration properties ([efa677f](https://github.com/pie-framework/pie-elements/commit/efa677f))





# 0.1.0 (2019-08-15)


### Features

* Added pie-model. ([30e7c46](https://github.com/pie-framework/pie-elements/commit/30e7c46))
* **charting:** Added charting package and started implementation (render charts, select chart type, define correct answer). (WIP) ([75efd72](https://github.com/pie-framework/pie-elements/commit/75efd72))
* **charting:** Scoring. ([b3b97e3](https://github.com/pie-framework/pie-elements/commit/b3b97e3))
* **charting:** Scoring. ([6088c42](https://github.com/pie-framework/pie-elements/commit/6088c42))
