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
  copyFileSync
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
  { name: 'copy', alias: 'c', type: Boolean }
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

const writeSchemaForPie = async (packageName: string, filePath: string) => {
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
  const dirs = getDirectories(pieDefinitionsDir);

  if (options.make) {
    removeSync('dist');
    mkdirpSync(outDir);
    dirs.forEach(dir => {
      const modelFile = resolve(pieDefinitionsDir, dir, 'index.ts');
      if (existsSync(modelFile)) {
        writeSchemaForPie(dir, modelFile);
      }
    });
  }

  if (options.copy) {
    console.log(
      'copy schemas from dist - needs to be run in context of pie-elements repository'
    );
    dirs.forEach(dir => {
      const pieDocsDir = resolve('../', dir, 'docs');
      if (existsSync(pieDocsDir)) {
        console.log('write schemas to ' + pieDocsDir);
        const configSchemaFile = resolve(outDir, dir, configSchemaFilename);
        const pieSchemaFile = resolve(outDir, dir, pieSchemaFilename);
        existsSync(configSchemaFile) &&
          copyFileSync(
            configSchemaFile,
            resolve(pieDocsDir, configSchemaFilename)
          );
        existsSync(pieSchemaFile) &&
          copyFileSync(pieSchemaFile, resolve(pieDocsDir, pieSchemaFilename));
      }
    });
  }
} else {
  console.log('no options passed');
}
