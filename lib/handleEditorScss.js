import fs from 'fs';
import path from 'path';

import { blocksBackEndBaseFilePath } from '../CONFIG.js';

function handleEditorScss() {
  const theme_root_dir = process.cwd();

  const blocks_backend_include_file_path = path.join(
    theme_root_dir,
    blocksBackEndBaseFilePath
  );

  function read() {
    // Read lines and transform to array
    const scss_backend_includes_arr = fs
      .readFileSync(blocks_backend_include_file_path)
      .toString()
      .split('\n');

    return scss_backend_includes_arr;
  }

  function write(new_data_arr) {
    fs.writeFileSync(
      blocks_backend_include_file_path,
      new_data_arr.join('\n'),
      'utf8'
    );
  }

  return {
    read,
    write,
  };
}

export default handleEditorScss;
