# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
