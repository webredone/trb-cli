import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import { blocksDirPath, blocksFrontEndProdDir } from '../CONFIG.js';
import handleEditorScss from './handleEditorScss.js';
import handleBlocksArr from './handleBlocksArr.js';

function removeBlock(blockName) {
  console.clear();

  blocksDirPath;

  const theme_root_dir = process.cwd();

  const block_to_be_removed_path = path.join(
    theme_root_dir,
    blocksDirPath,
    blockName
  );

  try {
    // REMOVE FOLDER FROM /BLOCKS DIR
    fs.rmdirSync(block_to_be_removed_path, { recursive: true });

    // Remove import from blocks_array.json
    const handleBlocksJsonImport = handleBlocksArr();
    const blocks_object = handleBlocksJsonImport.read();
    if (blocks_object.blocks_array.includes(blockName)) {
      blocks_object.blocks_array = [
        ...blocks_object.blocks_array.filter((bName) => bName !== blockName),
      ];

      handleBlocksJsonImport.write(blocks_object);
    }

    // REMOVE IMPORTED _EDITOR.SCSS
    const handleEditorScssImport = handleEditorScss();
    let scss_backend_includes_arr = handleEditorScssImport.read();
    const thisBlockEditorImport = `@import '../blocks/${blockName}/_editor';`;
    if (scss_backend_includes_arr.includes(thisBlockEditorImport)) {
      scss_backend_includes_arr = [
        ...scss_backend_includes_arr.filter(
          (line) => line !== thisBlockEditorImport
        ),
      ];
      handleEditorScssImport.write(scss_backend_includes_arr);
    }

    // REMOVE IMPORTED COMPILED frontend.min.css and frontend.min.js
    // if compiled block code dir exists
    const block_compiled_css_and_js_path = path.join(
      theme_root_dir,
      blocksFrontEndProdDir,
      blockName
    );
    if (fs.existsSync(block_compiled_css_and_js_path)) {
      fs.rmdirSync(block_compiled_css_and_js_path, { recursive: true });
    }

    console.log(
      chalk.green(`Block "${blockName}" has been successfully removed.\n`)
    );
  } catch (err) {
    console.error(`Error while removing ${err}.`);
  }
}

export default removeBlock;
