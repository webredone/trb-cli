import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import isSnakeCase from 'is-snake-case';

import {
  fieldsListPath,
  GET_FIELD_DOESNT_EXIST_ERROR,
  schemasPath,
} from '../CONFIG.js';

import isInThemeRoot from '../lib/isInThemeRoot.js';
import snakeCaseToTitleCase from '../lib/snakeCaseToTitleCase.js';

function generate_field_schema(field_type, field_name = false) {
  if (!isInThemeRoot()) return false;

  const theme_root_dir = process.cwd();

  const available_fields_array = JSON.parse(
    fs.readFileSync(path.join(theme_root_dir, fieldsListPath))
  ).fields;

  if (field_type !== field_type.toLowerCase()) {
    console.log(`\n${chalk.red(`${field_type} should be lowercase`)}\n`);
    return false;
  }

  if (!available_fields_array.includes(field_type)) {
    console.log(GET_FIELD_DOESNT_EXIST_ERROR(field_type));
    return false;
  }

  if (
    field_name &&
    (field_name !== field_name.toLowerCase() || !isSnakeCase(field_name))
  ) {
    console.log(
      `\n${chalk.red(
        `Make sure ${field_name} is written in lowercase snake_case`
      )}\n`
    );
    return false;
  }

  const fieldSchemaObj = JSON.parse(
    fs.readFileSync(
      path.join(theme_root_dir, schemasPath, `${field_type}.json`)
    )
  );

  const help = fieldSchemaObj.help;
  const fieldObj = fieldSchemaObj.title_snake_here;

  if (field_name) {
    fieldObj.field_meta.label = snakeCaseToTitleCase(field_name);
  }

  const formattedObj = `"${field_name || 'title_snake_here'}": ${JSON.stringify(
    fieldObj,
    null,
    2
  )}`;

  let consoleOutput = '\n';
  consoleOutput += chalk.yellow.bold(
    `Schema for the [${field_type}] field type`
  );
  consoleOutput += '\n\n';
  consoleOutput += chalk.green(formattedObj);
  consoleOutput += '\n\n';
  consoleOutput += `${chalk.yellow.bold(
    'Variations and additional settings to be used in "field_meta" for this field type'
  )}\n\n`;
  Object.entries(help).forEach(([key, val]) => {
    consoleOutput += `${chalk.green(`"${key}":`)} ${val}\n`;
  });

  console.log(consoleOutput);
}

export default generate_field_schema;
