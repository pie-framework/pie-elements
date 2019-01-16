
Typescript types & JSON Schemas for PIE Elments.

This project contains typescript interfaces for models used with PIE components.
It also generates JSON schema documentation for the models. 

## Usage

`npm install`

This will install the typescript lib and also provide the json schemas in `dist/schemas`.

### Typescript

Using the types will provide IDE auto-compplete and type-checking on model objects:

```ts
import {MultipleChoiceConfig} from `@pie-models`;

let myConfig:MultipleChoiceConfig = {...};
```



### View Docs

`npm run view-docs`

Will run a local docson server to view the schema documentation.

## Adding / modifying types

Types should be exported for the PIE in:

`src/pies/pie-name/index.ts`

Where `pie-name`is the same as the directory/package name for the pie in `../packages`.

> the `src/pies` directory should only contain subdirectories that match pies in `pie-elements/packages`


These `index.ts` files should create exports using the package name as pascale case with `Configure` or `Pie` appended. 

e.g. `CategorizeConfigure` `MultipleChoicePie`

`src/index.ts` should be updated with any new types.

