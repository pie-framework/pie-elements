# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry-controller@3.0.0...@pie-element/text-entry-controller@3.0.1) (2019-10-03)

**Note:** Version bump only for package @pie-element/text-entry-controller





# [3.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry-controller@2.1.1...@pie-element/text-entry-controller@3.0.0) (2019-09-17)


* Moved rationale, teacherInstructions and studentInstructions enabled flag in model because it's needed in controller. ([25e5d34](https://github.com/pie-framework/pie-elements/commit/25e5d34))


### BREAKING CHANGES

* `enabled` property from `configuration.rationale.enabled` moved to `model.rationaleEnabled`. Same applies to teacherInstructions/studentInstructions.





## [2.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry-controller@2.1.0...@pie-element/text-entry-controller@2.1.1) (2019-09-04)

**Note:** Version bump only for package @pie-element/text-entry-controller





# [2.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry-controller@2.0.8...@pie-element/text-entry-controller@2.1.0) (2019-08-27)


### Features

* Session null/empty check. ([f24dc8b](https://github.com/pie-framework/pie-elements/commit/f24dc8b))





## [2.0.8](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry-controller@2.0.7...@pie-element/text-entry-controller@2.0.8) (2019-08-26)

**Note:** Version bump only for package @pie-element/text-entry-controller





## [2.0.7](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry-controller@2.0.6...@pie-element/text-entry-controller@2.0.7) (2019-08-15)

**Note:** Version bump only for package @pie-element/text-entry-controller





## [2.0.6](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry-controller@2.0.5...@pie-element/text-entry-controller@2.0.6) (2019-07-05)

**Note:** Version bump only for package @pie-element/text-entry-controller





## [2.0.5](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry-controller@2.0.4...@pie-element/text-entry-controller@2.0.5) (2019-07-03)

**Note:** Version bump only for package @pie-element/text-entry-controller





## [2.0.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry-controller@2.0.3...@pie-element/text-entry-controller@2.0.4) (2019-03-18)

**Note:** Version bump only for package @pie-element/text-entry-controller





## [2.0.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry-controller@2.0.2...@pie-element/text-entry-controller@2.0.3) (2019-03-18)

**Note:** Version bump only for package @pie-element/text-entry-controller





## [2.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/text-entry-controller@2.0.1...@pie-element/text-entry-controller@2.0.2) (2019-03-18)

**Note:** Version bump only for package @pie-element/text-entry-controller





## 2.0.1 (2019-03-18)

**Note:** Version bump only for package @pie-element/text-entry-controller





<a name="2.0.0"></a>
# 2.0.0 (2018-09-20)


### Bug Fixes

* **dependecies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([4be839f](https://github.com/pie-framework/pie-elements/commit/4be839f))
* **dependencies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([6fea7bb](https://github.com/pie-framework/pie-elements/commit/6fea7bb))
* build fixes ([3c3a7f2](https://github.com/pie-framework/pie-elements/commit/3c3a7f2))


### Features

* **model:** move away from old model ([4763668](https://github.com/pie-framework/pie-elements/commit/4763668))
* **text-entry:** added prompt property ([10a6646](https://github.com/pie-framework/pie-elements/commit/10a6646))


### BREAKING CHANGES

* **model:** * Feedback now uses the new model
* `model` is gone, properties moved up a level.

Full example:

From:
```javascript

    {
      id: '1',
      element: 'text-entry',
      correctResponses: {
        values: ['mutt', 'hound'],
        ignoreWhitespace: true,
        ignoreCase: false,
        feedback: {
          type: 'custom',
          value: 'correct-o'
        }
      },
      partialResponses: {
        values: ['mutty'],
        ignoreWhitespace: true,
        ignoreCase: true,
        awardPercentage: '50',
        feedback: {
          type: 'custom',
          value: 'foo'
        }
      },
      incorrectFeedback: {
        type: 'custom',
        value: 'custom feedback'
      },
      model: {
        answerBlankSize: '10',
        answerAlignment: 'left',
        allowDecimal: true,
        allowIntegersOnly: false,
        allowThousandsSeparator: true
      }
    }

```

To:
```javascript
    {
      id: '1',
      element: 'text-entry',
      feedback: {
        correct: {
          type: 'custom',
          custom: 'correct-o'
        },
        incorrect: {
          type: 'custom',
          custom: 'custom feedback'
        },
        partial: {
          type: 'custom',
          custom: 'foo'
        }
      },
      correctResponses: {
        values: ['mutt', 'hound'],
        ignoreWhitespace: true,
        ignoreCase: false
      },
      partialResponses: {
        values: ['mutty'],
        ignoreWhitespace: true,
        ignoreCase: true,
        awardPercentage: '50'
      },
      answerBlankSize: '10',
      answerAlignment: 'left',
      allowDecimal: true,
      allowIntegersOnly: false,
      allowThousandsSeparator: true
    }
```
