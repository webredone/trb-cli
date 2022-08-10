import fs from 'fs';
import path from 'path';

import { blocksJsonPath } from '../CONFIG.js';

function handleBlocksArr() {
  function read() {
    const blocks_obj = JSON.parse(fs.readFileSync(blocksJsonPath));
    return blocks_obj;
  }

  function write(new_blocks_object) {
    const theme_root_dir = process.cwd();
    const blocks_array_json_file = path.join(theme_root_dir, blocksJsonPath);

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
