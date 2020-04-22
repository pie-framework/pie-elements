# running

## local

To run locally you'll need to change how the modules are linked. By default they are relative this works when all the js is running on the same cdn server like unpkg.com, but this won't work for local runs. To change this you can set the flag: `--moduleLinks unpkg` to get the links to be pulled in from unpkg instead of being relative.

```shell
yarn pslb --c pslb/pslb.config.js --moduleLinks unpkg
# static server or something similar
static packages
```

## building/publishing

```shell
yarn pslb --c pslb/pslb.config.js --publishLibs --token $NPM_TOKEN
```

## outstanding issues

- [ ] - image cloze association x not exported ....
- [ ] - graphing odd drag issue (no from?)
- [ ] - match-list, passage, protractror, ruler - no configure
- [ ] - rubric - root el pie
- [ ] - math-inline - process.env runtime error (debug lib)
- [ ] - placement-ordering: 'combination' is not exported by node_modules/js-combinatorics/combinatorics.js, imported by packages/placement-ordering/controller/src/scoring.js
