# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@4.0.1...@pie-element/pie-models@4.1.0) (2019-05-13)


### Features

* support paired passages ([#216](https://github.com/pie-framework/pie-elements/issues/216)) ([c036a92](https://github.com/pie-framework/pie-elements/commit/c036a92))





## [4.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@4.0.0...@pie-element/pie-models@4.0.1) (2019-05-10)

**Note:** Version bump only for package @pie-element/pie-models





# [4.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@3.0.1...@pie-element/pie-models@4.0.0) (2019-05-10)


### Features

* **categorize:** Updated with new version of [@pie-lib-config-ui](https://github.com/pie-lib-config-ui). Removed `model.config` and instead added new props directly on model: `choicesPerRow`, `categoriesPerRow`, `choicesPosition`, `choicesLabel`, `lockChoiceOrder`, `removeTilesAfterPlacing`. ([5922f85](https://github.com/pie-framework/pie-elements/commit/5922f85))


### BREAKING CHANGES

* **categorize:** `model.config` is removed, use `choicesPerRow`, `categoriesPerRow`, `choicesPosition`, `choicesLabel`, `lockChoiceOrder`, `removeTilesAfterPlacing` on model instead.





## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@3.0.0...@pie-element/pie-models@3.0.1) (2019-05-08)

**Note:** Version bump only for package @pie-element/pie-models





# [3.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@2.0.0...@pie-element/pie-models@3.0.0) (2019-05-08)


### Bug Fixes

* Renamed `multipleParts` with `multiple` for consistency. ([3685700](https://github.com/pie-framework/pie-elements/commit/3685700))


### Features

* Updated with new version of [@pie-lib-config-ui](https://github.com/pie-lib-config-ui). Removed `model.configure` and added a separate property called `configuration` instead. Removed usage of state (main.jsx) and updated tests. ([4262f6b](https://github.com/pie-framework/pie-elements/commit/4262f6b))
* Updated with new version of [@pie-lib-config-ui](https://github.com/pie-lib-config-ui). Removed `model.configure` and added a separate property called `configuration` instead. Removed usage of state (root.jsx) and updated tests. ([8f3ef1d](https://github.com/pie-framework/pie-elements/commit/8f3ef1d))
* Updated with new version of [@pie-lib-config-ui](https://github.com/pie-lib-config-ui). Removed `model.configure` and added a separate property called `configuration` instead. Removed usage of state (StateWrapper in configure.jsx) and updated tests. Updated `responseType` with `choiceMode` for consistency. ([dddd128](https://github.com/pie-framework/pie-elements/commit/dddd128))


### BREAKING CHANGES

* `model.configure` is removed, use `configuration` instead.
* `model.configure` is removed, use `configuration` instead.
* `model.configure` is removed, use `configuration` instead.





# [2.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.6.2...@pie-element/pie-models@2.0.0) (2019-05-07)


### Features

* Updated with new version of [@pie-lib-config-ui](https://github.com/pie-lib-config-ui). Renamed `configure` with `configuration`. Removed usage of state (root.jsx) and updated tests. ([8031454](https://github.com/pie-framework/pie-elements/commit/8031454))


### BREAKING CHANGES

* `configure` is removed, use `configuration` instead.





## [1.6.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.6.1...@pie-element/pie-models@1.6.2) (2019-05-02)

**Note:** Version bump only for package @pie-element/pie-models





## [1.6.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.6.0...@pie-element/pie-models@1.6.1) (2019-05-02)

**Note:** Version bump only for package @pie-element/pie-models





# [1.6.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.5.0...@pie-element/pie-models@1.6.0) (2019-05-01)


### Features

* **match-list:** generated json schemas for the pie-model an configure ([#186](https://github.com/pie-framework/pie-elements/issues/186)) ([e460871](https://github.com/pie-framework/pie-elements/commit/e460871))





# [1.5.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.4.2...@pie-element/pie-models@1.5.0) (2019-04-26)


### Features

* minimal passage rendering pie (no authoring) ([#185](https://github.com/pie-framework/pie-elements/issues/185)) ([87e5c4a](https://github.com/pie-framework/pie-elements/commit/87e5c4a))





## [1.4.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.4.1...@pie-element/pie-models@1.4.2) (2019-04-25)


### Bug Fixes

* **ebsr:** revert `itemStem` to `prompt`. ([107f398](https://github.com/pie-framework/pie-elements/commit/107f398))





## [1.4.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.4.0...@pie-element/pie-models@1.4.1) (2019-04-23)

**Note:** Version bump only for package @pie-element/pie-models





# [1.4.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.3.0...@pie-element/pie-models@1.4.0) (2019-04-23)


### Features

* **extended-text-entry:** Updated model structure with new established structure, integrated settings panel and updated tests. ([cdb29e4](https://github.com/pie-framework/pie-elements/commit/cdb29e4))
* **graph-lines:** Updated model structure with new established structure (a part of it), integrated settings panel and updated tests. ([a0c624f](https://github.com/pie-framework/pie-elements/commit/a0c624f))





# [1.3.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.2.0...@pie-element/pie-models@1.3.0) (2019-04-19)


### Features

* **math-inline:** Integrated settings panel. ([4d6c9dd](https://github.com/pie-framework/pie-elements/commit/4d6c9dd))





# [1.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.1.0...@pie-element/pie-models@1.2.0) (2019-04-18)


### Bug Fixes

* **multiple-choice:** Refactored using new established naming convention and updated tests. ([78ffbae](https://github.com/pie-framework/pie-elements/commit/78ffbae))


### Features

* **multiple-choice:** Integrated new settings panel. Updated tests. ([6387043](https://github.com/pie-framework/pie-elements/commit/6387043))





# [1.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.0.1...@pie-element/pie-models@1.1.0) (2019-04-17)


### Bug Fixes

* **placement-ordering:** Finished renaming model properties using naming conventions. ([d3d790a](https://github.com/pie-framework/pie-elements/commit/d3d790a))
* **placement-ordering:** Finished renaming model properties using new established naming conventions and integrated settings panel. ([74578c6](https://github.com/pie-framework/pie-elements/commit/74578c6))
* **placement-ordering:** renaming model properties with naming conventions. ([9d9be01](https://github.com/pie-framework/pie-elements/commit/9d9be01))


### Features

* **match:** Renamed model and configure properties using naming conventions and integrated settings panel. ([34ff2b1](https://github.com/pie-framework/pie-elements/commit/34ff2b1))





## [1.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@1.0.0...@pie-element/pie-models@1.0.1) (2019-04-10)

**Note:** Version bump only for package @pie-element/pie-models





# [1.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@0.5.4...@pie-element/pie-models@1.0.0) (2019-04-09)


### Features

* UI and model updates [ch423] ([b83c4b9](https://github.com/pie-framework/pie-elements/commit/b83c4b9))


### BREAKING CHANGES

* `moveOnDrag` is gone use `removeAllTilesAfterPlacing`.





## [0.5.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@0.5.3...@pie-element/pie-models@0.5.4) (2019-03-18)

**Note:** Version bump only for package @pie-element/pie-models





## [0.5.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@0.5.2...@pie-element/pie-models@0.5.3) (2019-03-18)

**Note:** Version bump only for package @pie-element/pie-models





## [0.5.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@0.5.1...@pie-element/pie-models@0.5.2) (2019-03-18)

**Note:** Version bump only for package @pie-element/pie-models





## [0.5.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@0.5.0...@pie-element/pie-models@0.5.1) (2019-03-18)

**Note:** Version bump only for package @pie-element/pie-models





# [0.5.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@0.4.2...@pie-element/pie-models@0.5.0) (2019-03-13)


### Bug Fixes

* update schema for match interaction ([#123](https://github.com/pie-framework/pie-elements/issues/123)) ([74fad0b](https://github.com/pie-framework/pie-elements/commit/74fad0b))


### Features

* update schema docs ([#136](https://github.com/pie-framework/pie-elements/issues/136)) ([184f262](https://github.com/pie-framework/pie-elements/commit/184f262))





## [0.4.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@0.4.1...@pie-element/pie-models@0.4.2) (2019-02-20)

**Note:** Version bump only for package @pie-element/pie-models





## [0.4.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@0.3.1...@pie-element/pie-models@0.4.1) (2019-02-13)

**Note:** Version bump only for package @pie-element/pie-models





## [0.3.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/pie-models@0.2.0...@pie-element/pie-models@0.3.1) (2019-02-13)

**Note:** Version bump only for package @pie-element/pie-models





# 0.2.0 (2019-02-08)


### Bug Fixes

* add partial scoring and shuffle prop for multiple-choice ([7577651](https://github.com/pie-framework/pie-elements/commit/7577651))
* add rows property for categorize docs ([0f68419](https://github.com/pie-framework/pie-elements/commit/0f68419))


### Features

* json schema generation ([2eb8c34](https://github.com/pie-framework/pie-elements/commit/2eb8c34))
* **docs:** select text docs fix, clarify mode property ([#117](https://github.com/pie-framework/pie-elements/issues/117)) ([46c30ab](https://github.com/pie-framework/pie-elements/commit/46c30ab))
