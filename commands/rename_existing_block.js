import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

import { blueprintBlockName, blocksDirPath } from '../CONFIG.js';
import isInThemeRoot from '../lib/isInThemeRoot.js';
import toKebabCase from '../lib/toKebabCase.js';
import renameBlock from '../lib/renameBlock.js';

function rename_existing_block(blockName, blockNewName) {
  if (!isInThemeRoot()) return false;

  if (blockName === blueprintBlockName || blockNewName === blueprintBlockName) {
    console.clear();
    console.log(
      `\n${chalk.red(
        `"${blueprintBlockName}" shouldn't be renamed, removed or used as a name for new blocks.`
      )}\n`
    );

    return false;
  }
  const theme_root_dir = process.cwd();

  const kebabCaseBlockName = toKebabCase(blockName);
  const kebabCaseNewBlockName = toKebabCase(blockNewName);
  const blockNameCaseErrorMsg = chalk.red(
    `Please write the block name: "${blockName}" in lowercase-kebab-case`
  );
  const newBlockNameCaseErrorMsg = chalk.red(
    `\nPlease write the new block name: "${blockNewName}" in lowercase-kebab-case`
  );
  if (
    kebabCaseBlockName !== blockName ||
    kebabCaseNewBlockName !== blockNewName
  ) {
    console.clear();
    console.log('\n');
    kebabCaseBlockName !== blockName && console.log(blockNameCaseErrorMsg);
    kebabCaseNewBlockName !== blockNewName &&
      console.log(newBlockNameCaseErrorMsg);
    console.log('\n');
    return false;
  }

  // If block doesn't exist in /blocks dir, exit
  if (!fs.existsSync(path.join(theme_root_dir, blocksDirPath, blockName))) {
    console.log(
      chalk.red(`\nIt appears that the block "${blockName}" doesn't exist.\n`)
    );
    return false;
  }

  // If newName already exists as a block
  if (fs.existsSync(path.join(theme_root_dir, blocksDirPath, blockNewName))) {
    console.clear();
    console.log(
      chalk.red(
        `\nIt appears that the new block name "${blockNewName}" is taken by an existing block.`
      )
    );
    console.log(chalk.yellow(`\nPlease choose another name.\n`));
    return false;
  }

  if (blockName === blockNewName) {
    console.log(
      chalk.red(`\nNew Block's name shouldn't be the same as the block's name`)
    );

    return false;
  }

  renameBlock(blockName, blockNewName);
}

export default rename_existing_block;
