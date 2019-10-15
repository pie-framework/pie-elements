# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@3.0.1...@pie-element/explicit-constructed-response-controller@3.0.2) (2019-10-15)


### Bug Fixes

* bump @pie-lib/controller-utils@^0.2.2 ([edae61c](https://github.com/pie-framework/pie-elements/commit/edae61c))





## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@3.0.0...@pie-element/explicit-constructed-response-controller@3.0.1) (2019-10-11)


### Bug Fixes

* bump @pie-lib/controller-utils@^0.2.1 [ch4723] ([0a33d68](https://github.com/pie-framework/pie-elements/commit/0a33d68))
* item details disappear if we click correct answer button [ch4723] ([8e401e6](https://github.com/pie-framework/pie-elements/commit/8e401e6))
* remove shuffling - redundant in this component [ch4723] ([b342305](https://github.com/pie-framework/pie-elements/commit/b342305))





# [3.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@2.3.1...@pie-element/explicit-constructed-response-controller@3.0.0) (2019-10-08)


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





## [2.3.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@2.3.0...@pie-element/explicit-constructed-response-controller@2.3.1) (2019-10-03)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





# [2.3.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@2.2.0...@pie-element/explicit-constructed-response-controller@2.3.0) (2019-10-03)


### Features

* **alternateSection:** removed isBrowser function [ch4599] and debounced some session changes in ecr [ch4387] ([01dc151](https://github.com/pie-framework/pie-elements/commit/01dc151))
* **alternateSection:** removed isBrowser function [ch4599], debounced some session changes in ecr [ch4387] and fixed select-text issue [ch4385] ([ab4478e](https://github.com/pie-framework/pie-elements/commit/ab4478e))





# [2.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@2.1.0...@pie-element/explicit-constructed-response-controller@2.2.0) (2019-10-03)


### Features

* **controller:** made sure that prepareVal works on environments that are not dom based [ch4599] ([c887e75](https://github.com/pie-framework/pie-elements/commit/c887e75))





# [2.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@2.0.1...@pie-element/explicit-constructed-response-controller@2.1.0) (2019-09-27)


### Features

* **explicit-constructed-response:** model based prompt ([9da37ac](https://github.com/pie-framework/pie-elements/commit/9da37ac))





## [2.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@2.0.0...@pie-element/explicit-constructed-response-controller@2.0.1) (2019-09-19)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





# [2.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.6.1...@pie-element/explicit-constructed-response-controller@2.0.0) (2019-09-17)


### Features

* Moved rationale, teacherInstructions and student instructions enabled flag in model because it's needed in controller. ([4fb4c5b](https://github.com/pie-framework/pie-elements/commit/4fb4c5b))


### BREAKING CHANGES

* `enabled` property from `configuration.rationale.enabled` moved to `model.rationaleEnabled`. Same applies to teacherInstructions/studentInstructions.





## [1.6.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.6.0...@pie-element/explicit-constructed-response-controller@1.6.1) (2019-09-05)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





# [1.6.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.5.0...@pie-element/explicit-constructed-response-controller@1.6.0) (2019-09-04)


### Bug Fixes

* bump pie-lib/controller-utils ([ba3de00](https://github.com/pie-framework/pie-elements/commit/ba3de00))


### Features

* make use of updateSession callback ([e11bb0f](https://github.com/pie-framework/pie-elements/commit/e11bb0f))





# [1.5.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.13...@pie-element/explicit-constructed-response-controller@1.5.0) (2019-08-27)


### Features

* Session null/empty check ([0538211](https://github.com/pie-framework/pie-elements/commit/0538211))





## [1.4.13](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.12...@pie-element/explicit-constructed-response-controller@1.4.13) (2019-08-26)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.4.12](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.11...@pie-element/explicit-constructed-response-controller@1.4.12) (2019-08-15)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.4.11](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.10...@pie-element/explicit-constructed-response-controller@1.4.11) (2019-08-02)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.4.10](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.9...@pie-element/explicit-constructed-response-controller@1.4.10) (2019-07-25)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.4.9](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.8...@pie-element/explicit-constructed-response-controller@1.4.9) (2019-07-19)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.4.8](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.7...@pie-element/explicit-constructed-response-controller@1.4.8) (2019-07-17)


### Bug Fixes

* support rationale ([36e3376](https://github.com/pie-framework/pie-elements/commit/36e3376))





## [1.4.7](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.6...@pie-element/explicit-constructed-response-controller@1.4.7) (2019-07-15)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.4.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.5...@pie-element/explicit-constructed-response-controller@1.4.6) (2019-07-13)


### Bug Fixes

* **template-areas:** fixed the remaining issues with the inline-dropdown and ecr [ch2797], [ch2802] ([1fbce9d](https://github.com/pie-framework/pie-elements/commit/1fbce9d))





## [1.4.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.4...@pie-element/explicit-constructed-response-controller@1.4.5) (2019-07-13)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.4.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.3...@pie-element/explicit-constructed-response-controller@1.4.4) (2019-07-12)


### Bug Fixes

* evaluate mode works if session empty ([4fe917b](https://github.com/pie-framework/pie-elements/commit/4fe917b))





## [1.4.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.2...@pie-element/explicit-constructed-response-controller@1.4.3) (2019-07-05)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.4.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.1...@pie-element/explicit-constructed-response-controller@1.4.2) (2019-07-03)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.4.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.4.0...@pie-element/explicit-constructed-response-controller@1.4.1) (2019-07-02)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





# [1.4.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.3.6...@pie-element/explicit-constructed-response-controller@1.4.0) (2019-07-02)


### Features

* **mask-markup-elements:** refactored the elements and version bumped the necessary files ([f8f77c0](https://github.com/pie-framework/pie-elements/commit/f8f77c0))





## [1.3.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.3.5...@pie-element/explicit-constructed-response-controller@1.3.6) (2019-06-26)


### Bug Fixes

* **rendering:** made sure all the items are rendered properly [c1935] ([61a85ab](https://github.com/pie-framework/pie-elements/commit/61a85ab))





## [1.3.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.3.4...@pie-element/explicit-constructed-response-controller@1.3.5) (2019-06-21)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.3.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.3.3...@pie-element/explicit-constructed-response-controller@1.3.4) (2019-06-20)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.3.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.3.2...@pie-element/explicit-constructed-response-controller@1.3.3) (2019-06-20)


### Bug Fixes

* **general:** fixed some general issues ([29a8bd3](https://github.com/pie-framework/pie-elements/commit/29a8bd3))





## [1.3.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.3.1...@pie-element/explicit-constructed-response-controller@1.3.2) (2019-06-17)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





## [1.3.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.3.0...@pie-element/explicit-constructed-response-controller@1.3.1) (2019-06-13)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





# [1.3.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.2.0...@pie-element/explicit-constructed-response-controller@1.3.0) (2019-06-12)


### Features

* **correct-responses:** updated elements with showing correct responses when needed ([8ea0d12](https://github.com/pie-framework/pie-elements/commit/8ea0d12))





# [1.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.1.1...@pie-element/explicit-constructed-response-controller@1.2.0) (2019-06-07)


### Features

* **mask-markup-elements:** enabled partial scoring for the 3 elements and added a controller to the match-list ([41e210e](https://github.com/pie-framework/pie-elements/commit/41e210e))





## [1.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/explicit-constructed-response-controller@1.1.0...@pie-element/explicit-constructed-response-controller@1.1.1) (2019-06-06)

**Note:** Version bump only for package @pie-element/explicit-constructed-response-controller





# 1.1.0 (2019-06-05)


### Features

* **mask-markup-elements:** most of the work for the 3 new elements: inline-dropdown, explicit-constructed-response and drag-in-the-blank ([67f3c3d](https://github.com/pie-framework/pie-elements/commit/67f3c3d))
