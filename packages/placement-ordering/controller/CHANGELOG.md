# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
