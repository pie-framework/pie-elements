# @pie-element/inline-choice

A [pie][pie]choice component.

## Usage 

To use this pie, you need to configure it within an Item. This means that you'll need to add it to the `index.html` and `config.json` files.

```html
<inline-choice pie-id="1"></inline-choice>
```

```javascript
{
  elements: {
    'pie-inline-choice': '@pie-element/inline-choice@^1.0.0'
  }
  models: [
    {
      id : "1",
      element: 'pie-inline-choice',
      defaultLang: "en-US",
      choiceMode: "single"
      // more configuration...
    }
  ]
}  
```

### Pie Demo 
There is a demo in `docs/demo` that you can run to see an example of it's usage.

To preview it in that context you'll need the [pie][pie] tool.

```shell
npm install -g pie 
cd inline-choice/docs/demo
pie serve #will build and serve the pie... then go to http://localhost:4000
```

## Test 

```shell 
npm test # run client and controller tests
npm run client-test # run client tests
npm run controller-test # run controller tests
```
[pie]: http://npmjs.org/package/pie
