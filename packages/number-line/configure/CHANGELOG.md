# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.2.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-configure@2.2.2...@pie-element/number-line-configure@2.2.3) (2019-03-18)

**Note:** Version bump only for package @pie-element/number-line-configure





## [2.2.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-configure@2.2.1...@pie-element/number-line-configure@2.2.2) (2019-03-18)

**Note:** Version bump only for package @pie-element/number-line-configure





## [2.2.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-configure@2.2.0...@pie-element/number-line-configure@2.2.1) (2019-03-18)

**Note:** Version bump only for package @pie-element/number-line-configure





# [2.2.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-configure@2.1.0...@pie-element/number-line-configure@2.2.0) (2019-03-18)


### Features

* **general:** initialize default model (2) ([#138](https://github.com/pie-framework/pie-elements/issues/138)) ([fc72eca](https://github.com/pie-framework/pie-elements/commit/fc72eca))





# [2.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-configure@2.0.3...@pie-element/number-line-configure@2.1.0) (2019-03-13)


### Features

* **general:** initialize default model ([#129](https://github.com/pie-framework/pie-elements/issues/129)) ([b62d058](https://github.com/pie-framework/pie-elements/commit/b62d058))
* all elements on `develop` target [@next](https://github.com/next) releases ([d3766e6](https://github.com/pie-framework/pie-elements/commit/d3766e6))





## [2.0.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-configure@2.0.2...@pie-element/number-line-configure@2.0.3) (2019-02-20)

**Note:** Version bump only for package @pie-element/number-line-configure





## [2.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-configure@2.0.1...@pie-element/number-line-configure@2.0.2) (2019-02-13)

**Note:** Version bump only for package @pie-element/number-line-configure





## [2.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-configure@2.0.0...@pie-element/number-line-configure@2.0.1) (2019-02-13)

**Note:** Version bump only for package @pie-element/number-line-configure





# 2.0.0 (2019-01-08)


### Bug Fixes

* **dependencies:** update dependencies ([2868681](https://github.com/pie-framework/pie-elements/commit/2868681))
* bump config-ui@^7.6.6 ([266235a](https://github.com/pie-framework/pie-elements/commit/266235a))
* dont import *.jsx files ([5811854](https://github.com/pie-framework/pie-elements/commit/5811854))
* **general:** bumped the config-ui version for all packages ([159521d](https://github.com/pie-framework/pie-elements/commit/159521d))


### Features

* **dependencies:** use latest [@pie-ui](https://github.com/pie-ui)/number-line ([e8fcdba](https://github.com/pie-framework/pie-elements/commit/e8fcdba))
* **dependencies:** use latest of [@pie-ui](https://github.com/pie-ui)/* ([ac9d2e5](https://github.com/pie-framework/pie-elements/commit/ac9d2e5))
* **model:** move away from legacy model ([9153342](https://github.com/pie-framework/pie-elements/commit/9153342))
* upgrade material-ui -> [@material-ui](https://github.com/material-ui)/core@1.0.0-rc.1 ([4a29a98](https://github.com/pie-framework/pie-elements/commit/4a29a98))


### BREAKING CHANGES

* **model:** Model has moved from:

* `model.config` -> `config`
* `feedback` - uses new feedback structure

Full example:

From:

```javascript

    {
      id: '1',
      element: 'number-line',
      correctResponse: [
        {
          type: 'point',
          pointType: 'full',
          domainPosition: 1
        },
        {
          type: 'line',
          leftPoint: 'full',
          rightPoint: 'empty',
          domainPosition: 1,
          size: 2
        }
      ],
      feedback: {
        correctFeedbackType: 'default',
        partialFeedbackType: 'default',
        incorrectFeedbackType: 'custom',
        incorrectFeedback: '<h1>incorrect</h1>'
      },
      allowPartialScoring: true,
      partialScoring: [
        {
          numberOfCorrect: 1,
          scorePercentage: 35
        }
      ],
      model: {
        config: {
          width: 500,
          height: 400,
          domain: [
            -5,
            5
          ],
          initialElements: [
            {
              type: 'point',
              pointType: 'empty',
              domainPosition: -1
            }
          ],
          maxNumberOfPoints: 20,
          tickFrequency: 6,
          showMinorTicks: true,
          snapPerTick: 1,
          tickLabelOverrides: [],
          initialType: 'PF',
          exhibitOnly: false,
          availableTypes: {
            PF: true,
            PE: true,
            LFF: true,
            LEF: true,
            LFE: true,
            LEE: true,
            RFN: true,
            RFP: true,
            REN: true,
            REP: true
          }
        }
      }
    }

```

To:

```javascript

 {
      id: '1',
      element: 'number-line',
      correctResponse: [
        {
          type: 'point',
          pointType: 'full',
          domainPosition: 1
        },
        {
          type: 'line',
          leftPoint: 'full',
          rightPoint: 'empty',
          domainPosition: 1,
          size: 2
        }
      ],
      feedback: {
        correct: {
          type: 'default',
          default: 'Correct'
        },
        partial: {
          type: 'default',
          default: 'Nearly'
        },
        incorrect: {
          type: 'custom',
          custom: '<h1>Incorrect</h1>'
        }
      },
      allowPartialScoring: true,
      partialScoring: [
        {
          numberOfCorrect: 1,
          scorePercentage: 35
        }
      ],
      config: {
        width: 500,
        height: 400,
        domain: [-5, 5],
        initialElements: [
          {
            type: 'point',
            pointType: 'empty',
            domainPosition: -1
          }
        ],
        maxNumberOfPoints: 20,
        tickFrequency: 6,
        showMinorTicks: true,
        snapPerTick: 1,
        tickLabelOverrides: [],
        initialType: 'PF',
        exhibitOnly: false,
        availableTypes: {
          PF: true,
          PE: true,
          LFF: true,
          LEF: true,
          LFE: true,
          LEE: true,
          RFN: true,
          RFP: true,
          REN: true,
          REP: true
        }
      }
    }

```
