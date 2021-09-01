# print how to

Brief guide on how to build pie-element print modules. Each element can have their own print module. It needs to be defined in the package.json `exports` map.


These modules will be published as part of the npm package.

We will then have a new element that 3rd parties can use to load up these elements: 

```html
<pie-print config={} options={}></pie-print>
```

This is being developed in another repo: https://github.com/key-data-systems/pie-print-support



## how to run a single element that will recompile when there are changes (no HMR):

`yarn pslb serve --config pslb/pslb.config.js --package @pie-element/multiple-choice --logLevel info`

Then go to: 

http://localhost:7752/multiple-choice/module/index.html


## how to build 

You prob won't need this but for your edification: 

`yarn pslb --config pslb/pslb.config.js --package @pie-element/multiple-choice --logLevel info`




