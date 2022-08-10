import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import { fieldsListPath } from '../CONFIG.js';
import isInThemeRoot from '../lib/isInThemeRoot.js';

function list_available_fields() {
  if (!isInThemeRoot()) return false;

  console.log(chalk.yellow('\nAvailable Field Types\n'));
  const theme_root_dir = process.cwd();

  const field_types_path = path.join(theme_root_dir, fieldsListPath);
  if (!fs.existsSync(field_types_path)) return;

  const fields_array = JSON.parse(fs.readFileSync(field_types_path)).fields;
  fields_array.forEach((fieldType, index) => {
    console.log(`${index + 1}: ${chalk.green(fieldType)}`);
  });
  console.log('\n');
}

export default list_available_fields;
