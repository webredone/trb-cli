import chalk from 'chalk';

const packageJSONPath = './package.json';
const gutenbergDirPath = './gutenberg';
const blocksDirPath = './gutenberg/blocks';
const blocksJsonPath = './gutenberg/core/blocks_array.json';
const fieldsListPath = './gutenberg/core/available_fields_list.json';
const schemasPath = './gutenberg/core/field_schema_blueprints';
const blueprintBlockName = 'new-block-blueprint';
const blocksFrontEndProdDir = './prod/block-specific';
const blocksBackEndBaseFilePath = './gutenberg/scss/blocks-backend.scss';

const ERROR_MSG_INCORRECT_DIR = chalk.red.bold(
  '\nMake sure to use the trb CLI from the "theme_redone" theme root.'
);
const VISIT_FOR_MORE_INFO = `Visit ${chalk.blue(
  'https://www.webredone.com'
)} to learn more\n`;

function GET_FIELD_DOESNT_EXIST_ERROR(field_type) {
  return `${chalk.red.bold(`\n${field_type} doesn't exist.`)}\n ${chalk.yellow(
    'trb fields_list'
  )} to see the list of existing fields.\n`;
}

const help = {
  add: `creates a new block with the provided name [block-name]. Use lowercase-kebab-case`,
  remove: `
trb remove block-name "removes the block and its files, in this case, it removes the [block-name] block"
`,
  list: `
"usage: ${chalk.yellow(
    'trb list'
  )} lists all the created and used blocks (blocks added to the blocks_array.json)"
`,
  rename: `rename the existing block`,
  copy: `
"usage: Copy selected block (argument 1) and paste it with the new name (argument 2)"
`,
  schema: `<field_type> ${chalk.red(
    'is mandatory'
  )}, [field_name] ${chalk.yellow(
    'is optional'
  )}. field_type is lowercase, field_name is snake_case. (Use ${chalk.yellow(
    'trb fields_list'
  )} to see the list of all available fields) Get the schema for ${chalk.yellow(
    'field_type'
  )} with the optional ${chalk.yellow(
    'field_name'
  )} for model.json. It will be pasted in the command line for you to copy/paste into the modal.json
`,
  fields_list: `
${chalk.yellow('Take a look at all the available field types')}
`,
};

export {
  packageJSONPath,
  gutenbergDirPath,
  blocksDirPath,
  blocksJsonPath,
  fieldsListPath,
  schemasPath,
  blueprintBlockName,
  blocksFrontEndProdDir,
  blocksBackEndBaseFilePath,
  ERROR_MSG_INCORRECT_DIR,
  VISIT_FOR_MORE_INFO,
  GET_FIELD_DOESNT_EXIST_ERROR,
  help,
};
