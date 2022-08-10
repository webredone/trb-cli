import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import { blocksDirPath, blueprintBlockName } from '../CONFIG.js';
import isInThemeRoot from '../lib/isInThemeRoot.js';
import toKebabCase from '../lib/toKebabCase.js';
import generateNewBlock from '../lib/generateNewBlock.js';

async function create_new_block(block_name) {
  if (block_name === blueprintBlockName) {
    console.log(
      `\n${chalk.red(
        `"${blueprintBlockName}" name is reserved.`
      )} ${chalk.yellow('Please give it a different name.\n')}`
    );

    return false;
  }

  if (!isInThemeRoot()) return false;

  const theme_root_dir = process.cwd();

  // If blocks folder is missing
  if (
    !fs.existsSync(path.join(theme_root_dir, blocksDirPath)) ||
    !fs.existsSync(
      path.join(theme_root_dir, blocksDirPath, 'new-block-blueprint')
    )
  ) {
    console.log(
      chalk.red(
        '\nIt appears that the /blocks folder or /blocks/new-block-blueprint is missing'
      )
    );
    console.log(
      chalk.red('\nPlease do not remove or rename those 2 folders\n')
    );
    return false;
  }

  const kebabCaseBlockName = toKebabCase(block_name);
  if (kebabCaseBlockName !== block_name) {
    console.log(
      chalk.red(
        `\nPlease write the block name: "${block_name}" in lowercase-kebab-case\n`
      )
    );
    return false;
  }

  // Check if block already exists as a dir in /blocks or as an entry in /blocks_array.json
  if (fs.existsSync(path.join(theme_root_dir, blocksDirPath, block_name))) {
    console.log(
      chalk.red(`\nIt appears that the block "${block_name}" already exists.\n`)
    );
    console.log(chalk.yellow('Please try again with a different name.\n'));
    return false;
  }

  // If not, then create it
  await generateNewBlock(block_name);
}

export default create_new_block;
