import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

import isInThemeOrPluginRoot from '../lib/isInThemeOrPluginRoot.js';
import toKebabCase from '../lib/toKebabCase.js';
import { FILES_PATHS } from '../CONFIG.js';
import copyBlock from '../lib/copyBlock.js';

function copy_existing_block(blockName, newBlockName) {
  console.clear();

  const projType = isInThemeOrPluginRoot();
  if (!projType) return false;

  const kebabCaseBlockName = toKebabCase(blockName);
  const kebabCaseNewBlockName = toKebabCase(newBlockName);
  const blockNameCaseErrorMsg = chalk.red(
    `Please write the block name: "${blockName}" in lowercase-kebab-case`
  );
  const newBlockNameCaseErrorMsg = chalk.red(
    `\nPlease write the new block name: "${newBlockName}" in lowercase-kebab-case`
  );
  if (
    kebabCaseBlockName !== blockName ||
    kebabCaseNewBlockName !== newBlockName
  ) {
    console.clear();
    console.log('\n');
    kebabCaseBlockName !== blockName && console.log(blockNameCaseErrorMsg);
    kebabCaseNewBlockName !== newBlockName &&
      console.log(newBlockNameCaseErrorMsg);
    console.log('\n');
    return false;
  }

  // If block doesn't exist in /blocks dir, exit
  const projectRootDir = process.cwd();
  if (
    !fs.existsSync(
      path.join(projectRootDir, FILES_PATHS.blocksDirPath[projType], blockName)
    )
  ) {
    console.log(
      chalk.red(`\nIt appears that the block "${blockName}" doesn't exist.\n`)
    );
    return false;
  }

  // If newName already exists as a block
  if (
    fs.existsSync(
      path.join(
        projectRootDir,
        FILES_PATHS.blocksDirPath[projType],
        newBlockName
      )
    )
  ) {
    console.clear();
    console.log(
      chalk.red(
        `\nIt appears that the new block name "${newBlockName}" is taken by an existing block.`
      )
    );
    console.log(chalk.yellow(`\nPlease choose another name.\n`));
    return false;
  }

  if (blockName === newBlockName) {
    console.log(
      chalk.red(`\nNew Block's name shouldn't be the same as the block's name`)
    );

    return false;
  }

  copyBlock(blockName, newBlockName);
}

export default copy_existing_block;
