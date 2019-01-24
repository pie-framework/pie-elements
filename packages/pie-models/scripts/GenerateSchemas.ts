import commandLineArgs from 'command-line-args';
import * as TJS from 'typescript-json-schema';
import { resolve, join } from 'path';
import {
  lstatSync,
  readdirSync,
  existsSync,
  writeFile,
  mkdirpSync,
  removeSync,
  copyFileSync,
  ensureDirSync,
  copy,
  copySync
} from 'fs-extra';
import { pascalCase } from 'change-case';
const deref = require('json-schema-deref-sync');
const generateMarkdown = require('wetzel');

const wetzelOptions = {
  suppressWarnings: true,
  headerLevel: 1
};

const optionDefinitions: Array<commandLineArgs.OptionDefinition> = [
  { name: 'make', alias: 'm', type: Boolean },
  { name: 'copy', alias: 'c', type: Boolean },
  { name: 'package', alias: 'p', type: String },
  { name: 'copy-dir', alias: 'd', type: String }
];

const options: commandLineArgs.CommandLineOptions = commandLineArgs(
  optionDefinitions
);

const pieDefinitionsDir = 'src/pie';
const outDir = join('dist', 'schemas');
const pieSchemaFilename = 'pie-schema.json';
const configSchemaFilename = 'config-schema.json';

const tjsSettings: TJS.PartialArgs = {
  required: true,
  titles: true
};

const dereferenceSchema = (schema: TJS.Definition): Promise<Object> => {
  return deref(schema);
};

const getDirectories = (p: any) =>
  readdirSync(p).filter(f => lstatSync(join(p, f)).isDirectory());

const writeDocs = async (
  tjsSchema: TJS.Definition,
  outDir: string,
  schemaFile: string,
  docTitle: string
) => {
  let schema = await dereferenceSchema(tjsSchema);
  schema = {
    ...schema,
    title: docTitle,
    $schema: 'http://json-schema.org/draft-03/schema'
  };
  writeFile(join(outDir, schemaFile), JSON.stringify(schema, null, 2));
  // make markdown
  const mkDocs = generateMarkdown({ ...wetzelOptions, schema });
  writeFile(join(outDir, schemaFile + '.md'), mkDocs);
};

const processTypescriptFile = async (packageName: string, filePath: string) => {
  const typePrefix = pascalCase(packageName);
  const packageOutDir = join(outDir, packageName);
  mkdirpSync(packageOutDir);

  console.log(`generated ${packageOutDir}`);

  // load schemas
  const program = TJS.getProgramFromFiles([filePath]);
  const generator = TJS.buildGenerator(program, tjsSettings);

  if (generator) {
    // write config model
    try {
      const configSchema = generator.getSchemaForSymbol(
        typePrefix + 'Configure'
      );
      await writeDocs(
        configSchema,
        packageOutDir,
        configSchemaFilename,
        packageName + '-configure'
      );
    } catch (error) {
      console.log(`no config available for ${packageName}`);
    }
    try {
      const pieSchema = generator.getSchemaForSymbol(typePrefix + 'Pie');
      await writeDocs(
        pieSchema,
        packageOutDir,
        pieSchemaFilename,
        packageName + '-pie'
      );
    } catch (error) {
      console.log(`no pie model available for ${packageName}`);
    }
  } else {
    console.error(`could not load schema files for ${packageName}`);
  }
};

if (options.make || options.copy) {
  let dirs = getDirectories(pieDefinitionsDir);
  if (options['package']) {
    dirs = dirs.filter(dir => {
      return options['package'] === dir;
    });
  }

  if (options.make) {
    removeSync('dist');
    mkdirpSync(outDir);
    dirs.forEach(dir => {
      const modelFile = resolve(pieDefinitionsDir, dir, 'index.ts');
      if (existsSync(modelFile)) {
        processTypescriptFile(dir, modelFile);
      }
    });
  }

  if (options.copy) {
    // defaults assumes running in pie-elements repo and will copy to
    // pie-elements/packages/pie-name/docs
    let baseDocsDestinationDir = resolve('../');
    if (options['copy-dir']) {
      baseDocsDestinationDir = options['copy-dir'];
      ensureDirSync(baseDocsDestinationDir);
    }
    console.log(`copying schemas from ${outDir} to ${baseDocsDestinationDir}`);
    dirs.forEach(dir => {
      const pieDocsDir = resolve(baseDocsDestinationDir, dir, 'docs');
      // create dir if passed dir option
      options['copy-dir'] && ensureDirSync(pieDocsDir);
      const generatedDocsDir = resolve(outDir, dir);
      if (existsSync(pieDocsDir)) {
        copySync(generatedDocsDir, pieDocsDir);
      } else {
        console.log(`dir: ${baseDocsDestinationDir} does not exist`);
      }
    });
  }
} else {
  console.log('no options passed');
}
