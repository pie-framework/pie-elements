# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-configure@1.1.0...@pie-element/placement-ordering-configure@1.1.1) (2019-01-08)


### Bug Fixes

* **general:** bumped the config-ui version for all packages ([159521d](https://github.com/pie-framework/pie-elements/commit/159521d))





# [1.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/placement-ordering-configure@1.0.0...@pie-element/placement-ordering-configure@1.1.0) (2018-11-12)


### Bug Fixes

* **dependencies-add:** added dependencies where needed ([23df697](https://github.com/pie-framework/pie-elements/commit/23df697))


### Features

* **placement-ordering-configure-customization:** made some elements from the design config customizable (ch564) ([a89ff83](https://github.com/pie-framework/pie-elements/commit/a89ff83))





<a name="1.0.0"></a>
# 1.0.0 (2018-10-18)


### Bug Fixes

* **dependencies:** fix dependencies ([38ec3f6](https://github.com/pie-framework/pie-elements/commit/38ec3f6))
* **dependencies:** update dependency names ([dc789ac](https://github.com/pie-framework/pie-elements/commit/dc789ac))
* **placement-ordering:** fix drag context import and export ([5b4a99c](https://github.com/pie-framework/pie-elements/commit/5b4a99c))
* [@material-ui](https://github.com/material-ui)/* version bump ([db58db9](https://github.com/pie-framework/pie-elements/commit/db58db9))
* bump config-ui@^7.6.6 ([266235a](https://github.com/pie-framework/pie-elements/commit/266235a))


### Features

* upgrade material-ui -> [@material-ui](https://github.com/material-ui)/core@1.0.0-rc.1 ([02ac71a](https://github.com/pie-framework/pie-elements/commit/02ac71a))
* **ch467:** updated 2 packages ([04fdd85](https://github.com/pie-framework/pie-elements/commit/04fdd85))
* **dependencies:** use latest [@pie-ui](https://github.com/pie-ui)/placement-ordering ([fd9d12d](https://github.com/pie-framework/pie-elements/commit/fd9d12d))
* **dependencies:** use latest of [@pie-ui](https://github.com/pie-ui)/* ([ac9d2e5](https://github.com/pie-framework/pie-elements/commit/ac9d2e5))
* **model:** move away from old model ([048571e](https://github.com/pie-framework/pie-elements/commit/048571e))


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
