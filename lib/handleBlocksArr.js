import fs from 'fs';
import path from 'path';

import { FILES_PATHS } from '../CONFIG.js';

import isInThemeOrPluginRoot from './isInThemeOrPluginRoot.js';

function handleBlocksArr() {
  const projType = isInThemeOrPluginRoot();

  function read() {
    const blocks_obj = JSON.parse(
      fs.readFileSync(FILES_PATHS.blocksJsonPath[projType])
    );
    return blocks_obj;
  }

  function write(new_blocks_object) {
    const projectRootDir = process.cwd();
    const blocks_array_json_file = path.join(
      projectRootDir,
      FILES_PATHS.blocksJsonPath[projType]
    );

    try {
      fs.writeFileSync(
        blocks_array_json_file,
        JSON.stringify(new_blocks_object, null, 2),
        'utf8'
      );
    } catch (err) {
      console.log(chalk.red(err));
      console.log('\n');
    }
  }

  return {
    read,
    write,
  };
}

export default handleBlocksArr;
