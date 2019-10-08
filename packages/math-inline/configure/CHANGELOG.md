# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@4.1.2...@pie-element/math-inline-configure@4.1.3) (2019-10-04)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [4.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@4.1.1...@pie-element/math-inline-configure@4.1.2) (2019-10-03)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [4.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@4.1.0...@pie-element/math-inline-configure@4.1.1) (2019-10-03)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [4.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@4.0.0...@pie-element/math-inline-configure@4.1.0) (2019-09-27)


### Bug Fixes

* added feedbackEnabled property to model, removed usage on config.feedback.enabled and removed usage of allowFeedback (replaced with feedbackEnabled). ([c47fb9a](https://github.com/pie-framework/pie-elements/commit/c47fb9a))


### Features

* **math-inline:** model based prompt ([d7910e3](https://github.com/pie-framework/pie-elements/commit/d7910e3))





# [4.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@3.0.2...@pie-element/math-inline-configure@4.0.0) (2019-09-17)


* Moved rationale, teacherInstructions and studentInstructions enabled flag in model because it's needed in controller. ([07b7da9](https://github.com/pie-framework/pie-elements/commit/07b7da9))


### BREAKING CHANGES

* `enabled` property from `configuration.rationale.enabled` moved to `model.rationaleEnabled`. Same applies to teacherInstructions/studentInstructions.





## [3.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@3.0.1...@pie-element/math-inline-configure@3.0.2) (2019-08-27)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@3.0.0...@pie-element/math-inline-configure@3.0.1) (2019-08-26)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [3.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.6.3...@pie-element/math-inline-configure@3.0.0) (2019-08-21)


### Bug Fixes

* Fixed Add Alternate when default alternates were defined. Send 'response' if response type is 'simple', send 'responses' if response type is 'advance multi' to ui. ([609a0d7](https://github.com/pie-framework/pie-elements/commit/609a0d7))
* Removed unnecessary response property from the model. ([b0a0f3d](https://github.com/pie-framework/pie-elements/commit/b0a0f3d))


### BREAKING CHANGES

* `response` was removed from model, use responses instead.





## [2.6.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.6.2...@pie-element/math-inline-configure@2.6.3) (2019-08-21)


### Bug Fixes

* **math-rendering:** updated all dependent packages for math rendering and for editable-html [ch3365], [ch1530] ([33e3287](https://github.com/pie-framework/pie-elements/commit/33e3287))





## [2.6.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.6.1...@pie-element/math-inline-configure@2.6.2) (2019-08-18)


### Bug Fixes

* **math-rendering:** updated all dependent packages [ch3365] ([7cbf25a](https://github.com/pie-framework/pie-elements/commit/7cbf25a))
* set default values to configuration properties ([3cdd889](https://github.com/pie-framework/pie-elements/commit/3cdd889))





## [2.6.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.6.0...@pie-element/math-inline-configure@2.6.1) (2019-08-15)


### Bug Fixes

* Removed dummy prompt. Updated pie model and config schema. Initialized configuration. ([19b2d36](https://github.com/pie-framework/pie-elements/commit/19b2d36))
* **elements:** version bumped the editable-html packages [ch1738] ([949222a](https://github.com/pie-framework/pie-elements/commit/949222a))





# [2.6.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.5.4...@pie-element/math-inline-configure@2.6.0) (2019-08-02)


### Features

* **math-inline:** question becomes prompt and gets treated universally ([91cbbe1](https://github.com/pie-framework/pie-elements/commit/91cbbe1))





## [2.5.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.5.3...@pie-element/math-inline-configure@2.5.4) (2019-07-25)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.5.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.5.2...@pie-element/math-inline-configure@2.5.3) (2019-07-12)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.5.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.5.1...@pie-element/math-inline-configure@2.5.2) (2019-07-12)


### Bug Fixes

* **rendering:** implemented rendering for math elements [ch1915], [ch1935] ([2f35842](https://github.com/pie-framework/pie-elements/commit/2f35842))





## [2.5.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.5.0...@pie-element/math-inline-configure@2.5.1) (2019-07-12)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [2.5.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.4.9...@pie-element/math-inline-configure@2.5.0) (2019-07-11)


### Features

* **template-elements:** updated the dependent packages that use editable-html and fixed [ch2564], [ch2565], [ch2538], [ch2489], [ch2557], [ch2593], [ch2490], [ch2527] ([a87febe](https://github.com/pie-framework/pie-elements/commit/a87febe))





## [2.4.9](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.4.8...@pie-element/math-inline-configure@2.4.9) (2019-07-09)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.4.8](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.4.7...@pie-element/math-inline-configure@2.4.8) (2019-07-09)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.4.7](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.4.6...@pie-element/math-inline-configure@2.4.7) (2019-07-07)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.4.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.4.5...@pie-element/math-inline-configure@2.4.6) (2019-07-07)


### Bug Fixes

* **editable-html:** fixed lots of stuff regarding the editable-html ([12c1129](https://github.com/pie-framework/pie-elements/commit/12c1129))





## [2.4.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.4.4...@pie-element/math-inline-configure@2.4.5) (2019-07-05)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.4.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.4.3...@pie-element/math-inline-configure@2.4.4) (2019-07-04)


### Bug Fixes

* **template-els:** fixed some ditb issues ([9133840](https://github.com/pie-framework/pie-elements/commit/9133840))





## [2.4.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.4.2...@pie-element/math-inline-configure@2.4.3) (2019-07-03)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.4.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.4.1...@pie-element/math-inline-configure@2.4.2) (2019-07-03)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.4.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.4.0...@pie-element/math-inline-configure@2.4.1) (2019-07-02)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [2.4.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.3.1...@pie-element/math-inline-configure@2.4.0) (2019-07-02)


### Bug Fixes

* **math-inline:** interaction fixes, controller logic adjustment and small styling changes ([40a1dc1](https://github.com/pie-framework/pie-elements/commit/40a1dc1))


### Features

* **mask-markup-elements:** refactored the elements and version bumped the necessary files ([f8f77c0](https://github.com/pie-framework/pie-elements/commit/f8f77c0))
* **math-inline:** allowing decimals in response is valid for literal validation too ([4c17840](https://github.com/pie-framework/pie-elements/commit/4c17840))





## [2.3.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.3.0...@pie-element/math-inline-configure@2.3.1) (2019-06-26)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [2.3.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.2.1...@pie-element/math-inline-configure@2.3.0) (2019-06-26)


### Features

* **settings-panel:** updated the settings panel design and changes needed for [ch2242] ([d830e57](https://github.com/pie-framework/pie-elements/commit/d830e57))





## [2.2.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.2.0...@pie-element/math-inline-configure@2.2.1) (2019-06-23)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [2.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.12...@pie-element/math-inline-configure@2.2.0) (2019-06-21)


### Features

* **general:** updated all the packages that have the config-ui as a dependency ([44061de](https://github.com/pie-framework/pie-elements/commit/44061de))





## [2.1.12](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.11...@pie-element/math-inline-configure@2.1.12) (2019-06-20)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.1.11](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.10...@pie-element/math-inline-configure@2.1.11) (2019-06-18)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.1.10](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.9...@pie-element/math-inline-configure@2.1.10) (2019-06-17)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.1.9](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.8...@pie-element/math-inline-configure@2.1.9) (2019-06-13)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.1.8](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.7...@pie-element/math-inline-configure@2.1.8) (2019-06-12)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.1.7](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.6...@pie-element/math-inline-configure@2.1.7) (2019-06-07)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.1.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.5...@pie-element/math-inline-configure@2.1.6) (2019-06-06)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.1.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.4...@pie-element/math-inline-configure@2.1.5) (2019-06-05)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.1.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.3...@pie-element/math-inline-configure@2.1.4) (2019-05-31)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.1.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.2...@pie-element/math-inline-configure@2.1.3) (2019-05-23)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [2.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.1...@pie-element/math-inline-configure@2.1.2) (2019-05-21)


### Bug Fixes

* **math-inline:** no longer show response index, until we support individual correctness ([02ba999](https://github.com/pie-framework/pie-elements/commit/02ba999))





## [2.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.1.0...@pie-element/math-inline-configure@2.1.1) (2019-05-16)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [2.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.0.1...@pie-element/math-inline-configure@2.1.0) (2019-05-14)


### Features

* Sending rationale for `instructor` mode. ([e297e50](https://github.com/pie-framework/pie-elements/commit/e297e50))
* **math-inline:** added rationale support. ([7a4f9d4](https://github.com/pie-framework/pie-elements/commit/7a4f9d4))





## [2.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@2.0.0...@pie-element/math-inline-configure@2.0.1) (2019-05-10)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [2.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@1.0.9...@pie-element/math-inline-configure@2.0.0) (2019-05-08)


### Features

* Updated with new version of [@pie-lib-config-ui](https://github.com/pie-lib-config-ui). Renamed configure with configuration. Removed usage of state (StateWrapper in configure.jsx) and updated tests. ([cfe9edd](https://github.com/pie-framework/pie-elements/commit/cfe9edd))


### BREAKING CHANGES

* configure is removed, use configuration instead.





## [1.0.9](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@1.0.8...@pie-element/math-inline-configure@1.0.9) (2019-05-08)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [1.0.8](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@1.0.7...@pie-element/math-inline-configure@1.0.8) (2019-05-07)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [1.0.7](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@1.0.6...@pie-element/math-inline-configure@1.0.7) (2019-05-03)


### Bug Fixes

* **math-inline:** vital null checks and onFocus for editable-html ([0ebeaa4](https://github.com/pie-framework/pie-elements/commit/0ebeaa4))





## [1.0.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@1.0.5...@pie-element/math-inline-configure@1.0.6) (2019-05-02)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [1.0.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@1.0.4...@pie-element/math-inline-configure@1.0.5) (2019-05-02)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [1.0.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@1.0.3...@pie-element/math-inline-configure@1.0.4) (2019-05-01)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [1.0.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@1.0.2...@pie-element/math-inline-configure@1.0.3) (2019-04-26)


### Bug Fixes

* Updated with new version of @pie-lib/config-ui & @pie-ui/math-inline. ([6f0459d](https://github.com/pie-framework/pie-elements/commit/6f0459d))





## [1.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@1.0.1...@pie-element/math-inline-configure@1.0.2) (2019-04-25)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [1.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@1.0.0...@pie-element/math-inline-configure@1.0.1) (2019-04-23)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [1.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.6.0...@pie-element/math-inline-configure@1.0.0) (2019-04-23)


### Bug Fixes

* **math-inline:** centralized variables for interaction modes ([5afa51a](https://github.com/pie-framework/pie-elements/commit/5afa51a))


### Features

* **math-inline:** formulaV2 support for controller and relevant config panel adjustments ([168f0d5](https://github.com/pie-framework/pie-elements/commit/168f0d5))


### BREAKING CHANGES

* **math-inline:** controller validation schema is now using formulaV2 approach, resulting interface is changed and partial scoring is no longer supported





# [0.6.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.5.1...@pie-element/math-inline-configure@0.6.0) (2019-04-19)


### Features

* **math-inline:** Integrated settings panel. ([4d6c9dd](https://github.com/pie-framework/pie-elements/commit/4d6c9dd))





## [0.5.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.5.0...@pie-element/math-inline-configure@0.5.1) (2019-04-12)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [0.5.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.4.2...@pie-element/math-inline-configure@0.5.0) (2019-04-11)


### Bug Fixes

* minor adjustments ([2865349](https://github.com/pie-framework/pie-elements/commit/2865349))


### Features

* **math-inline:** decimal support and partial scoring ([84b1292](https://github.com/pie-framework/pie-elements/commit/84b1292))





## [0.4.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.4.1...@pie-element/math-inline-configure@0.4.2) (2019-04-08)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [0.4.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.4.0...@pie-element/math-inline-configure@0.4.1) (2019-04-04)


### Bug Fixes

* bump configure dependencies ([ff0b7ae](https://github.com/pie-framework/pie-elements/commit/ff0b7ae))
* bump math deps ([1573e90](https://github.com/pie-framework/pie-elements/commit/1573e90))
* bump math-input ([b27313b](https://github.com/pie-framework/pie-elements/commit/b27313b))
* remove mathquill ref from general-config-block ([ae5faf9](https://github.com/pie-framework/pie-elements/commit/ae5faf9))





# [0.4.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.3.4...@pie-element/math-inline-configure@0.4.0) (2019-03-26)


### Bug Fixes

* continued mathquill math-input work ([18bd710](https://github.com/pie-framework/pie-elements/commit/18bd710))


### Features

* **math-inline:** html and math support for item stem ([c317deb](https://github.com/pie-framework/pie-elements/commit/c317deb))





## [0.3.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.3.3...@pie-element/math-inline-configure@0.3.4) (2019-03-19)


### Bug Fixes

* **math-inline:** fix simple mode interaction and remove defaultResponse from model ([cc82516](https://github.com/pie-framework/pie-elements/commit/cc82516))





## [0.3.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.3.2...@pie-element/math-inline-configure@0.3.3) (2019-03-18)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [0.3.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.3.1...@pie-element/math-inline-configure@0.3.2) (2019-03-18)

**Note:** Version bump only for package @pie-element/math-inline-configure





## [0.3.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.3.0...@pie-element/math-inline-configure@0.3.1) (2019-03-18)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [0.3.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.2.0...@pie-element/math-inline-configure@0.3.0) (2019-03-18)


### Features

* **general:** initialize default model (2) ([#138](https://github.com/pie-framework/pie-elements/issues/138)) ([fc72eca](https://github.com/pie-framework/pie-elements/commit/fc72eca))





# [0.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.1.2...@pie-element/math-inline-configure@0.2.0) (2019-03-13)


### Features

* **general:** initialize default model ([#129](https://github.com/pie-framework/pie-elements/issues/129)) ([b62d058](https://github.com/pie-framework/pie-elements/commit/b62d058))
* all elements on `develop` target [@next](https://github.com/next) releases ([d3766e6](https://github.com/pie-framework/pie-elements/commit/d3766e6))





## [0.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.1.1...@pie-element/math-inline-configure@0.1.2) (2019-02-20)


### Bug Fixes

* **math-inline:** keypad update for different types and keypad fixes ([d6e4a81](https://github.com/pie-framework/pie-elements/commit/d6e4a81))





## [0.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.1.0...@pie-element/math-inline-configure@0.1.1) (2019-02-13)

**Note:** Version bump only for package @pie-element/math-inline-configure





# [0.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.0.3...@pie-element/math-inline-configure@0.1.0) (2019-02-13)


### Bug Fixes

* rm flex ([b7bcdb9](https://github.com/pie-framework/pie-elements/commit/b7bcdb9))
* **math-inline:** fix math-input dependency usages for mathquill wrapper ([4c91e18](https://github.com/pie-framework/pie-elements/commit/4c91e18))


### Features

* **math-inline:** answer block generation related functionality ([045173e](https://github.com/pie-framework/pie-elements/commit/045173e))
* **math-inline:** answer block indexes fix ([2b1821a](https://github.com/pie-framework/pie-elements/commit/2b1821a))
* **math-inline:** config panel and controller done for initial release ([f8d4ed8](https://github.com/pie-framework/pie-elements/commit/f8d4ed8))
* **math-inline:** configure component name ([8e0d816](https://github.com/pie-framework/pie-elements/commit/8e0d816))
* **math-inline:** configure package version bump ([85763c5](https://github.com/pie-framework/pie-elements/commit/85763c5))
* **math-inline:** configure package version bump ([0078dcb](https://github.com/pie-framework/pie-elements/commit/0078dcb))
* **math-inline:** dependency version bump for mathquill paranthesis styling fixes around custom elements ([54a1904](https://github.com/pie-framework/pie-elements/commit/54a1904))
* **math-inline:** finalize for first release ([e33b3ad](https://github.com/pie-framework/pie-elements/commit/e33b3ad))
* **math-inline:** initial implementation ([58fdd5e](https://github.com/pie-framework/pie-elements/commit/58fdd5e))
* **math-inline:** line breaks in math editor ([b1a3ccb](https://github.com/pie-framework/pie-elements/commit/b1a3ccb))
* **math-inline:** math-toolbar version bump for line break support ([d60e90a](https://github.com/pie-framework/pie-elements/commit/d60e90a))
* **math-inline:** pie-ui math-inline version bump and update ([67363af](https://github.com/pie-framework/pie-elements/commit/67363af))
* **math-inline:** pie-ui math-inline version bump to pull in various fixes ([846ae82](https://github.com/pie-framework/pie-elements/commit/846ae82))
* **math-inline:** remove unnecessary test files, until tests are written ([de717ce](https://github.com/pie-framework/pie-elements/commit/de717ce))
* **math-inline:** updated package version ([7a59038](https://github.com/pie-framework/pie-elements/commit/7a59038))





## [0.0.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/math-inline-configure@0.0.2...@pie-element/math-inline-configure@0.0.3) (2019-01-08)


### Bug Fixes

* **general:** bumped the config-ui version for all packages ([159521d](https://github.com/pie-framework/pie-elements/commit/159521d))





## 0.0.2 (2018-11-26)


### Bug Fixes

* **math-inline:** config and controller package names ([e477d10](https://github.com/pie-framework/pie-elements/commit/e477d10))
* **math-inline:** initial placeholder tests and fixes ([05125e6](https://github.com/pie-framework/pie-elements/commit/05125e6))
* **math-inline:** initial placeholder tests and fixes ([1644b94](https://github.com/pie-framework/pie-elements/commit/1644b94))
* **math-inline:** package versions ([286626f](https://github.com/pie-framework/pie-elements/commit/286626f))
