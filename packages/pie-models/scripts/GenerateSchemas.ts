import * as TJS from "typescript-json-schema";
import {resolve, join} from "path";
import { lstatSync, readdirSync, existsSync, writeFileSync, mkdirpSync, removeSync } from 'fs-extra';
import {pascalCase, paramCase, camelCase} from 'change-case';


const PIE_DEFINITIONS_DIR = "src/pie";
const OUT_DIR = join('dist', 'schemas');

const SETTINGS: TJS.PartialArgs = {
  required: true
};

removeSync('dist');
mkdirpSync(OUT_DIR);


const getDirectories = (p: any) => readdirSync(p).filter(f => lstatSync(join(p, f)).isDirectory())
const dirs = getDirectories(PIE_DEFINITIONS_DIR);



const writeSchemaForPie = (packageName: string, filePath:string)  => {
  const typePrefix = pascalCase(packageName);
  const packageOutDir = join(OUT_DIR, packageName);
  mkdirpSync(packageOutDir);

  console.log(`generated ${packageOutDir}`);

  // load schemas
  const program = TJS.getProgramFromFiles([filePath]);
  const generator = TJS.buildGenerator(program, SETTINGS);

  if (generator) {
   
    // write config model
    try {
      const configSchema = generator.getSchemaForSymbol(typePrefix +  'Configure');
      writeFileSync(join(packageOutDir, 'config-schema.json'), JSON.stringify(configSchema, null, 2));
    } catch (error) {
      console.log(`no config available for ${packageName}`);
    }
    try {
      const pieSchema = generator.getSchemaForSymbol(typePrefix +  'Pie');
      writeFileSync(join(packageOutDir, 'pie-schema.json'), JSON.stringify(pieSchema, null, 2));
    } catch (error) {
      console.log(`no pie model available for ${packageName}`);
    }
 
  } else {
    console.error(`could not load schema files for ${packageName}`);
  }

}


dirs.forEach(dir => {
  const modelFile = resolve(PIE_DEFINITIONS_DIR, dir, 'index.ts');
  if (existsSync(modelFile))  {

    writeSchemaForPie(dir, modelFile);
  }
});




