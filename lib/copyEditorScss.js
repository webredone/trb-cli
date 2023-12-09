import fs from 'fs';
import path from 'path';

import { FILES_PATHS } from '../CONFIG.js';

import isInThemeOrPluginRoot from './isInThemeOrPluginRoot.js';

const projectRootDir = process.cwd();

function copyEditorScss(oldBlockName, newBlockName) {
  const projType = isInThemeOrPluginRoot();

  const _new_editor_scss_path = path.join(
    projectRootDir,
    FILES_PATHS.blocksDirPath[projType],
    newBlockName,
    '_editor.scss'
  );

  const _editor_scss_exists = fs.existsSync(_new_editor_scss_path);

  if (!_editor_scss_exists) {
    console.log(
      chalk.yellow(
        `\nIt appears that the _editor.scss file is missing. If you need it, you should create and import it manually.\n`
      )
    );
  } else {
    // Continue here
    updateEditorScss(_new_editor_scss_path, oldBlockName, newBlockName);
  }
}

function updateEditorScss(editorScssPath, oldBlockName, newBlockName) {
  if (oldBlockName === 'new-block-blueprint') {
    oldBlockName = 'BLOCK_NAME_HERE';
  }

  let _editor_scss_content = fs
    .readFileSync(editorScssPath)
    .toString()
    .split('\n');

  // If file has content
  if (_editor_scss_content.length) {
    // TODO: Replace sidebar selectors as well
    _editor_scss_content = _editor_scss_content.map((line) => {
      if (line.includes(`.tr-block-wrap--${oldBlockName}`)) {
        line = line.replace(oldBlockName, newBlockName);
      }
      return line;
    });
  }

  // Convert to string again
  _editor_scss_content = _editor_scss_content.join('\n');
  // Prepare for writing
  _editor_scss_content = new Uint8Array(Buffer.from(_editor_scss_content));
  try {
    fs.writeFileSync(editorScssPath, _editor_scss_content, 'utf8');
  } catch (err) {
    console.log(chalk.red(err));
    console.log('\n');
  }
}

export default copyEditorScss;
export { updateEditorScss };
