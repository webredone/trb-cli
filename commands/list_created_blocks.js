import { readdirSync } from 'fs';
import chalk from 'chalk';

import { blocksDirPath } from '../CONFIG.js';
import isInThemeRoot from '../lib/isInThemeRoot.js';
import handleBlocksArr from '../lib/handleBlocksArr.js';

const getBlocksFolderNames = (blocksDirPath) =>
  readdirSync(blocksDirPath, {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

function list_created_blocks() {
  // const theme_root_dir = process.cwd();

  if (!isInThemeRoot()) return false;
  console.clear();
  console.log('\n');
  console.log(
    chalk.yellow.bold('A List of Registered Blocks in blocks_array.json\n')
  );

  const blocks_array = handleBlocksArr().read().blocks_array;
  blocks_array.forEach((blockName, index) => {
    console.log(`${index + 1}: ${chalk.green(blockName)}`);
  });
  console.log('\n');
  console.log(chalk.yellow.bold('A List of all the blocks folders\n'));

  const blocks_folder_names = getBlocksFolderNames(blocksDirPath);
  blocks_folder_names.forEach((blockDirName, index) => {
    console.log(`${index + 1}: ${chalk.green(blockDirName)}`);
  });
}

export default list_created_blocks;
