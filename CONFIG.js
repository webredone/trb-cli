import chalk from "chalk";

const FILES_PATHS = {
  packageJSONPath: "./package.json",
  gutenbergDirPath: {
    theme: "./gutenberg",
  },
  blocksDirPath: {
    theme: "./gutenberg/blocks",
    plugin: "./src/blocks",
  },
  blocksJsonPath: {
    theme: "./gutenberg/core/blocks_array.json",
    plugin: "./src/core/blocks_array.json",
  },
  // TODO: This is maybe not needed. Check, and remove if not.
  fieldsListPath: {
    theme: "./gutenberg/core/available_fields_list.json",
    plugin: "./src/core/available_fields_list.json",
  },
  // TODO: This is maybe not needed. Check, and remove if not.
  schemasPath: {
    theme: "./gutenberg/core/field_schema_blueprints",
    plugin: "./src/core/field_schema_blueprints",
  },
  blueprintBlockName: "new-block-blueprint",
  blueprintBlockDir: {
    theme: "./gutenberg/blocks/new-block-blueprint",
    plugin: "./src/core/new-block-blueprint",
  },
  // TODO: Standardize thijs. Use dist in both cases.
  blocksFrontEndProdDir: {
    theme: "./prod/block-specific",
    plugin: "./dist/block-specific",
  },
  blocksBackEndBaseFilePath: {
    theme: "./gutenberg/scss/blocks-backend.scss",
    plugin: "./src/core/framework-logic/scss/blocks-backend.scss",
  },
  editorScss: {
    theme: `@import '../blocks`,
    plugin: `@import '../../../blocks`,
  },
};

const ERROR_MSG_INCORRECT_DIR = chalk.red.bold(
  '\nMake sure to use the trb CLI from the "theme_redone" theme root, or the "trbs-framework" plugin root.'
);

const VISIT_FOR_MORE_INFO = `Visit ${chalk.blue(
  "https://www.webredone.com"
)} to learn more\n`;

function GET_FIELD_DOESNT_EXIST_ERROR(field_type) {
  return `${chalk.red.bold(`\n${field_type} doesn't exist.`)}\n ${chalk.yellow(
    "trb fields_list"
  )} to see the list of existing fields.\n`;
}

const help = {
  add: `creates a new block with the provided name [block-name]. Use lowercase-kebab-case`,
  remove: `
trb remove block-name "removes the block and its files, in this case, it removes the [block-name] block"
`,
  list: `
"usage: ${chalk.yellow(
    "trb list"
  )} lists all the created and used blocks (blocks added to the blocks_array.json)"
`,
  rename: `rename the existing block`,
  copy: `
"usage: Copy selected block (argument 1) and paste it with the new name (argument 2)"
`,
  schema: `<field_type> ${chalk.red(
    "is mandatory"
  )}, [field_name] ${chalk.yellow(
    "is optional"
  )}. field_type is lowercase, field_name is snake_case. (Use ${chalk.yellow(
    "trb fields_list"
  )} to see the list of all available fields) Get the schema for ${chalk.yellow(
    "field_type"
  )} with the optional ${chalk.yellow(
    "field_name"
  )} for model.json. It will be pasted in the command line for you to copy/paste into the modal.json
`,
  fields_list: `
${chalk.yellow("Take a look at all the available field types")}
`,
};

export {
  FILES_PATHS,
  ERROR_MSG_INCORRECT_DIR,
  VISIT_FOR_MORE_INFO,
  GET_FIELD_DOESNT_EXIST_ERROR,
  help,
};
