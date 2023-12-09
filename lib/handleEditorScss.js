import fs from 'fs';
import path from 'path';

import { FILES_PATHS } from '../CONFIG.js';

import isInThemeOrPluginRoot from './isInThemeOrPluginRoot.js';

function handleEditorScss() {
  const projectRootDir = process.cwd();

  const projType = isInThemeOrPluginRoot();

  const blocks_backend_include_file_path = path.join(
    projectRootDir,
    FILES_PATHS.blocksBackEndBaseFilePath[projType]
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
