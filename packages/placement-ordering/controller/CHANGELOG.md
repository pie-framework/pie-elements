# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@4.1.2...@pie-element/placement-ordering-controller@4.1.3) (2019-07-03)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





## [4.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@4.1.1...@pie-element/placement-ordering-controller@4.1.2) (2019-05-23)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





## [4.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@4.1.0...@pie-element/placement-ordering-controller@4.1.1) (2019-05-21)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





# [4.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@4.0.1...@pie-element/placement-ordering-controller@4.1.0) (2019-05-16)


### Features

* Sending rationale for `instructor` role only in 'view' or 'evaluate' mode. ([ea90849](https://github.com/pie-framework/pie-elements/commit/ea90849))
* **placement-ordering:** added rationale support. ([d6df005](https://github.com/pie-framework/pie-elements/commit/d6df005))





## [4.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@4.0.0...@pie-element/placement-ordering-controller@4.0.1) (2019-05-08)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





# [4.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@3.2.7...@pie-element/placement-ordering-controller@4.0.0) (2019-05-08)


### Features

* Updated with new version of [@pie-lib-config-ui](https://github.com/pie-lib-config-ui). Removed `model.configure` and added a separate property called `configuration` instead. Removed usage of state (main.jsx) and updated tests. ([4262f6b](https://github.com/pie-framework/pie-elements/commit/4262f6b))


### BREAKING CHANGES

* `model.configure` is removed, use `configuration` instead.





## [3.2.7](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@3.2.6...@pie-element/placement-ordering-controller@3.2.7) (2019-05-02)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





## [3.2.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@3.2.5...@pie-element/placement-ordering-controller@3.2.6) (2019-05-02)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





## [3.2.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@3.2.4...@pie-element/placement-ordering-controller@3.2.5) (2019-05-01)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





## [3.2.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@3.2.3...@pie-element/placement-ordering-controller@3.2.4) (2019-04-26)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





## [3.2.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@3.2.2...@pie-element/placement-ordering-controller@3.2.3) (2019-04-25)


### Bug Fixes

* **ebsr:** revert `itemStem` to `prompt`. ([107f398](https://github.com/pie-framework/pie-elements/commit/107f398))





## [3.2.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@3.2.1...@pie-element/placement-ordering-controller@3.2.2) (2019-04-18)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





## [3.2.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@3.2.0...@pie-element/placement-ordering-controller@3.2.1) (2019-04-17)


### Bug Fixes

* Fixed test. ([5b2d7d4](https://github.com/pie-framework/pie-elements/commit/5b2d7d4))
* Updated controller test. ([e9246e0](https://github.com/pie-framework/pie-elements/commit/e9246e0))
* **placement-ordering:** Finished renaming model properties using naming conventions. ([d3d790a](https://github.com/pie-framework/pie-elements/commit/d3d790a))
* **placement-ordering:** Finished renaming model properties using new established naming conventions and integrated settings panel. ([74578c6](https://github.com/pie-framework/pie-elements/commit/74578c6))
* **placement-ordering:** renaming model properties with naming conventions. ([9d9be01](https://github.com/pie-framework/pie-elements/commit/9d9be01))





# [3.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@3.1.1...@pie-element/placement-ordering-controller@3.2.0) (2019-04-12)


### Features

* **scoring:** `orderMustBeComplete` defaults to false ([3b11755](https://github.com/pie-framework/pie-elements/commit/3b11755))





## [3.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@3.1.0...@pie-element/placement-ordering-controller@3.1.1) (2019-04-11)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





# [3.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@3.0.0...@pie-element/placement-ordering-controller@3.1.0) (2019-04-10)


### Features

* scoring change [ch440] ([42507f5](https://github.com/pie-framework/pie-elements/commit/42507f5))





# [3.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@2.1.4...@pie-element/placement-ordering-controller@3.0.0) (2019-04-09)


### Features

* partial scoring logic updated to use pairwise combinations [ch440] ([2761b85](https://github.com/pie-framework/pie-elements/commit/2761b85))
* UI and model updates [ch423] ([b83c4b9](https://github.com/pie-framework/pie-elements/commit/b83c4b9))


### BREAKING CHANGES

* `question.partialScoring` is no longer a set of rules
with weights. It's now a boolean.
* `moveOnDrag` is gone use `removeAllTilesAfterPlacing`.





## [2.1.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@2.1.3...@pie-element/placement-ordering-controller@2.1.4) (2019-03-18)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





## [2.1.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@2.1.2...@pie-element/placement-ordering-controller@2.1.3) (2019-03-18)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





## [2.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@2.1.1...@pie-element/placement-ordering-controller@2.1.2) (2019-03-18)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





## [2.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-controller@2.1.0...@pie-element/placement-ordering-controller@2.1.1) (2019-03-18)

**Note:** Version bump only for package @pie-element/placement-ordering-controller





# 2.1.0 (2019-03-13)


### Features

* **general:** initialize default model ([#129](https://github.com/pie-framework/pie-elements/issues/129)) ([b62d058](https://github.com/pie-framework/pie-elements/commit/b62d058))





# 2.0.0 (2018-11-12)


### Bug Fixes

* **controller:** bump feedback version ([a07c9ec](https://github.com/pie-framework/pie-elements/commit/a07c9ec))
* **dependecies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([4be839f](https://github.com/pie-framework/pie-elements/commit/4be839f))


### Features

* **model:** move away from old model ([048571e](https://github.com/pie-framework/pie-elements/commit/048571e))
* **placement-ordering-configure-customization:** made some elements from the design config customizable (ch564) ([a89ff83](https://github.com/pie-framework/pie-elements/commit/a89ff83))


### BREAKING CHANGES

* **model:** The model has changed.

* `model` is gone, all properties within it have moved to the root.
* `config` is gone, all properties within it have moved to the root.
* `feedback` is using the new model.

From:

```javascript
{
      id: '1',
      element: 'placement-ordering',
      correctResponse: [
        {
          id: 'c1',
          weight: 0.2
        },
        {
          id: 'c4',
          weight: 0.2
        },
        {
          id: 'c3',
          weight: 0.3
        },
        {
          id: 'c2',
          weight: 0.3
        }
      ],
      model: {
        prompt: 'Arrange the fruits alphabetically',
        choices: [
          {
            id: 'c2',
            label: 'Lemon',
            shuffle: false,
            moveOnDrag: true
          },
          {
            id: 'c3',
            label: 'Melon',
            moveOnDrag: true
          },
          {
            id: 'c1',
            label: 'Blueberry',
            moveOnDrag: false
          },
          {
            id: 'c4',
            label: 'Pear',
            moveOnDrag: false
          }
        ]
      },
      config: {
        shuffle: false,
        placementType: 'none',
        choiceAreaLayout: 'vertical',
        choiceAreaLabel: 'choices: ',
        answerAreaLabel: 'Answer Area Label',
        showOrdering: true
      },
      feedback: {
        correctFeedbackType: 'custom',
        correctFeedback: 'foo',
        incorrectFeedbackType: 'custom',
        incorrectFeedback: 'foo',
        partialFeedbackType: 'custom',
        partialFeedback: 'foo',
      }
    }
```

To:

```javascript

{
      id: '1',
      element: 'placement-ordering',
      correctResponse: [
        {
          id: 'c1',
          weight: 0.2
        },
        {
          id: 'c4',
          weight: 0.2
        },
        {
          id: 'c3',
          weight: 0.3
        },
        {
          id: 'c2',
          weight: 0.3
        }
      ],
      prompt: 'Arrange the fruits alphabetically',
      choices: [
        {
          id: 'c2',
          label: 'Lemon',
          shuffle: false,
          moveOnDrag: true
        },
        {
          id: 'c3',
          label: 'Melon',
          moveOnDrag: true
        },
        {
          id: 'c1',
          label: 'Blueberry',
          moveOnDrag: false
        },
        {
          id: 'c4',
          label: 'Pear',
          moveOnDrag: false
        }
      ],
      shuffle: false,
      placementType: 'none',
      choiceAreaLayout: 'vertical',
      choiceAreaLabel: 'choices: ',
      answerAreaLabel: 'Answer Area Label',
      showOrdering: true,
      feedback: {
        correct: {
          type: 'custom',
          custom: 'foo'
        },
        incorrect: {
          type: 'custom',
          custom: 'no'
        },
        partial: {
          type: 'custom',
          custom: 'nearly'
        }
      }
    }

```
