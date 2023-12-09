import { readdirSync } from 'fs';
import chalk from 'chalk';

import { FILES_PATHS } from '../CONFIG.js';
import isInThemeOrPluginRoot from '../lib/isInThemeOrPluginRoot.js';

const getBlocksFolderNames = (blocksDirPath) =>
  readdirSync(blocksDirPath, {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

function list_created_blocks() {
  const projType = isInThemeOrPluginRoot();

  if (!projType) return false;
  console.clear();

  console.log('\n');
  console.log(
    chalk.yellow.bold('A List of Registered Blocks in blocks_array.json\n')
  );

  const blocks_folder_names = getBlocksFolderNames(
    FILES_PATHS.blocksDirPath[projType]
  );
  blocks_folder_names.forEach((blockDirName, index) => {
    console.log(`${index + 1}: ${chalk.green(blockDirName)}`);
  });
}

export default list_created_blocks;
