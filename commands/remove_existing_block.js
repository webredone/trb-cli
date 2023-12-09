import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';

import { FILES_PATHS } from '../CONFIG.js';
import removeBlock from '../lib/removeBlock.js';
import isInThemeOrPluginRoot from '../lib/isInThemeOrPluginRoot.js';
import toKebabCase from '../lib/toKebabCase.js';

function continueRemoval(blockName) {
  const projType = isInThemeOrPluginRoot();

  if (!projType) return false;

  const projectRootDir = process.cwd();

  if (
    !fs.existsSync(
      path.join(projectRootDir, FILES_PATHS.blocksDirPath[projType])
    ) ||
    !fs.existsSync(
      path.join(projectRootDir, FILES_PATHS.blueprintBlockDir[projType])
    )
  ) {
    console.clear();
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

  if (blockName === FILES_PATHS.blueprintBlockName[projType]) {
    console.clear();
    console.log(
      `\n${chalk.red(
        `"${FILES_PATHS.blueprintBlockName[projType]}" shouldn't be deleted.\n`
      )}`
    );
    return false;
  }

  const kebabCaseBlockName = toKebabCase(blockName);
  if (kebabCaseBlockName !== blockName) {
    console.clear();
    console.log(
      chalk.red(
        `\nPlease write the block name: "${blockName}" in lowercase-kebab-case\n`
      )
    );
    return false;
  }

  // If block doesn't exist
  if (
    !fs.existsSync(
      path.join(projectRootDir, FILES_PATHS.blocksDirPath[projType], blockName)
    )
  ) {
    console.clear();
    console.log(
      chalk.red(`\nIt appears that the block "${blockName}" doesn't exist.\n`)
    );
    return false;
  }

  return true;
}

function remove_existing_block(blockName) {
  const questionString = chalk.yellow(
    `\If you sure you want to remove "${blockName}" block, type "yes", otherwise, type whatever or hit ctrl + c (Windows) or cmd + c (Mac)?\n`
  );

  if (!continueRemoval(blockName)) {
    return false;
  } else {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(questionString, function (answer) {
      if (answer === 'yes') {
        removeBlock(blockName);
      } else {
        console.log(chalk.yellow('Aborted.'));
      }
      rl.close();
    });
  }
}

export default remove_existing_block;
