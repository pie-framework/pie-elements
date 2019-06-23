# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-controller@3.1.1...@pie-element/number-line-controller@4.0.0) (2019-06-23)


### Features

* number line updates ([f4dbf3d](https://github.com/pie-framework/pie-elements/commit/f4dbf3d))


### BREAKING CHANGES

* `domain` is now `{min:number,max:number}`, `ticks:
{minor:number, major:number}` added.





## [3.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-controller@3.1.0...@pie-element/number-line-controller@3.1.1) (2019-05-14)

**Note:** Version bump only for package @pie-element/number-line-controller





# [3.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-controller@3.0.1...@pie-element/number-line-controller@3.1.0) (2019-05-14)


### Features

* **number-line:** added prompt support. ([324824c](https://github.com/pie-framework/pie-elements/commit/324824c))





## [3.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-controller@3.0.0...@pie-element/number-line-controller@3.0.1) (2019-05-10)

**Note:** Version bump only for package @pie-element/number-line-controller





# [3.0.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-controller@2.1.4...@pie-element/number-line-controller@3.0.0) (2019-05-10)


### Features

* Transformed defaults into an object that has model and configuration property. Renamed `model.config` with `model.graph`. ([6548972](https://github.com/pie-framework/pie-elements/commit/6548972))


### BREAKING CHANGES

* `model.config` will not be used anymore. Use `model.graph` instead, to configure the graph.





## [2.1.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-controller@2.1.3...@pie-element/number-line-controller@2.1.4) (2019-03-18)

**Note:** Version bump only for package @pie-element/number-line-controller





## [2.1.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-controller@2.1.2...@pie-element/number-line-controller@2.1.3) (2019-03-18)

**Note:** Version bump only for package @pie-element/number-line-controller





## [2.1.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-controller@2.1.1...@pie-element/number-line-controller@2.1.2) (2019-03-18)

**Note:** Version bump only for package @pie-element/number-line-controller





## [2.1.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/number-line-controller@2.1.0...@pie-element/number-line-controller@2.1.1) (2019-03-18)

**Note:** Version bump only for package @pie-element/number-line-controller





# 2.1.0 (2019-03-13)


### Features

* **general:** initialize default model ([#129](https://github.com/pie-framework/pie-elements/issues/129)) ([b62d058](https://github.com/pie-framework/pie-elements/commit/b62d058))





<a name="2.0.0"></a>
# 2.0.0 (2018-09-20)


### Bug Fixes

* **controller:** bump feedback version ([a07c9ec](https://github.com/pie-framework/pie-elements/commit/a07c9ec))
* **dependencies:** bump [@pie-lib](https://github.com/pie-lib)/feedback ([6fea7bb](https://github.com/pie-framework/pie-elements/commit/6fea7bb))
* build fixes ([3c3a7f2](https://github.com/pie-framework/pie-elements/commit/3c3a7f2))


### Features

* **model:** move away from legacy model ([9153342](https://github.com/pie-framework/pie-elements/commit/9153342))


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





<a name="1.1.0"></a>
# [1.1.0](https://github.com/pie-framework/pie-ui/compare/@pie-ui/number-line-controller@1.0.2...@pie-ui/number-line-controller@1.1.0) (2018-04-17)


### Features

* **tests:** use jest for tests ([237fb58](https://github.com/pie-framework/pie-ui/commit/237fb58))




<a name="1.0.2"></a>
## 1.0.2 (2018-03-06)




**Note:** Version bump only for package @pie-ui/number-line-controller
