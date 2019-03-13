# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/pie-framework/pie-elements/compare/@pie-element/ruler-configure@2.0.4...@pie-element/ruler-configure@2.1.0) (2019-03-13)


### Features

* **general:** initialize default model ([#129](https://github.com/pie-framework/pie-elements/issues/129)) ([b62d058](https://github.com/pie-framework/pie-elements/commit/b62d058))
* all elements on `develop` target [@next](https://github.com/next) releases ([d3766e6](https://github.com/pie-framework/pie-elements/commit/d3766e6))





## [2.0.4](https://github.com/pie-framework/pie-elements/compare/@pie-element/ruler-configure@2.0.3...@pie-element/ruler-configure@2.0.4) (2019-02-20)

**Note:** Version bump only for package @pie-element/ruler-configure





## [2.0.3](https://github.com/pie-framework/pie-elements/compare/@pie-element/ruler-configure@2.0.2...@pie-element/ruler-configure@2.0.3) (2019-02-13)

**Note:** Version bump only for package @pie-element/ruler-configure





## [2.0.2](https://github.com/pie-framework/pie-elements/compare/@pie-element/ruler-configure@2.0.1...@pie-element/ruler-configure@2.0.2) (2019-02-13)

**Note:** Version bump only for package @pie-element/ruler-configure





## [2.0.1](https://github.com/pie-framework/pie-elements/compare/@pie-element/ruler-configure@2.0.0...@pie-element/ruler-configure@2.0.1) (2019-01-08)


### Bug Fixes

* **general:** bumped the config-ui version for all packages ([159521d](https://github.com/pie-framework/pie-elements/commit/159521d))
* **general:** removed a comma ([2433aeb](https://github.com/pie-framework/pie-elements/commit/2433aeb))





<a name="2.0.0"></a>
# 2.0.0 (2018-09-20)


### Bug Fixes

* **dependencies:** use [@pie-ui](https://github.com/pie-ui)/ruler@^1.1.1 ([6760220](https://github.com/pie-framework/pie-elements/commit/6760220))
* **dependencies:** use [@pie-ui](https://github.com/pie-ui)/ruler@^1.2.0 ([4944688](https://github.com/pie-framework/pie-elements/commit/4944688))
* build fixes ([3c3a7f2](https://github.com/pie-framework/pie-elements/commit/3c3a7f2))
* bump config-ui@^7.6.6 ([266235a](https://github.com/pie-framework/pie-elements/commit/266235a))


### Features

* **configure:** add configuration ui for ruler ([84462ab](https://github.com/pie-framework/pie-elements/commit/84462ab))
* **model:** move to new model ([3e5e747](https://github.com/pie-framework/pie-elements/commit/3e5e747))
* **ruler:** add new ruler component ([0943e49](https://github.com/pie-framework/pie-elements/commit/0943e49))
* upgrade material-ui -> [@material-ui](https://github.com/material-ui)/core@1.0.0-rc.1 ([4a86e00](https://github.com/pie-framework/pie-elements/commit/4a86e00))


### BREAKING CHANGES

* **model:** Model has changed.

FROM:

```javascript

    {
      model: {
        config: {
          units: 'metric',
          label: 'm',
          length: 20,
          pixelsPerUnit: 30,
          ticks: 10
        }
      }
    }

```

TO:

```javascript
   {
      measure: 'metric',
      label: 'm',
      units: 10,
      width: 500,
      imperialTicks: undefined
    }
```
