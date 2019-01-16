import * as TJS from "typescript-json-schema";
import {resolve, join} from "path";
import { lstatSync, readdirSync, existsSync, writeFileSync, mkdirpSync, removeSync } from 'fs-extra';
import {pascalCase, paramCase, camelCase} from 'change-case';


interface PiePackageModelDefinition {
  configModelFile: string;
  itemModelFile: string;
  packageName: string;
}


const pieDefinitions:Array<PiePackageModelDefinition> = [];

const PIE_DEFINITIONS_DIR = "src/pie";
const OUT_DIR = join('dist', 'schemas');

const SETTINGS: TJS.PartialArgs = {
  required: true
};

removeSync('dist');
mkdirpSync(OUT_DIR);


const getDirectories = (p: any) => readdirSync(p).filter(f => lstatSync(join(p, f)).isDirectory())
const dirs = getDirectories(PIE_DEFINITIONS_DIR);

dirs.forEach(dir => {
  const itemModelFile = resolve(PIE_DEFINITIONS_DIR, dir, 'Pie.ts');
  const configModelFile = resolve(PIE_DEFINITIONS_DIR, dir, 'Configure.ts');
  if (existsSync(itemModelFile))  {
    pieDefinitions.push({
      packageName: dir,
      itemModelFile,
      configModelFile
    });
  }
});



pieDefinitions.forEach(def => {
  const typePrefix = pascalCase(def.packageName);
  const packageOutDir = join(OUT_DIR, def.packageName);
  mkdirpSync(packageOutDir);

  console.log(`generated ${packageOutDir}`);

  // load schemas
  const files = [def.configModelFile, def.itemModelFile].filter(existsSync);
  const program = TJS.getProgramFromFiles(files);
  const generator = TJS.buildGenerator(program, SETTINGS);

  if (generator) {
   
    // write config model
    if (files.some(x => x === def.configModelFile)) {
      
      const configSchema = generator.getSchemaForSymbol(typePrefix +  'Configure');
      writeFileSync(join(packageOutDir, 'config-schema.json'), JSON.stringify(configSchema, null, 2));
    }
     // write item model
    if (files.some(x => x === def.itemModelFile)) {
      const itemSchema = generator.getSchemaForSymbol(typePrefix +  'Pie');
      writeFileSync(join(packageOutDir, 'pie-schema.json'), JSON.stringify(itemSchema, null, 2));
    }
 
  } else {
    console.error(`could not load schema files for ${def.packageName}`);
  }
  
});




