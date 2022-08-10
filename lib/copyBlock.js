import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import ncp from 'ncp';
import chalk from 'chalk';

import { blocksDirPath, blocksFrontEndProdDir } from '../CONFIG.js';
import handleEditorScss from './handleEditorScss.js';
import handleBlocksArr from './handleBlocksArr.js';
import updateModelJson from './updateModelJson.js';
import copyEditorScss from './copyEditorScss.js';

const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

async function copyBlock(blockName, newBlockName) {
  console.clear();

  const theme_root_dir = process.cwd();

  const block_path = path.join(theme_root_dir, blocksDirPath, blockName);
  const new_block_path = path.join(theme_root_dir, blocksDirPath, newBlockName);

  const options = {
    templateDirectory: block_path,
    targetDirectory: new_block_path,
  };

  // COPYING THE DIR
  await copyTemplateFiles(options);

  // RENAMING THE CLASSNAME IN THE SCSS FILE
  copyEditorScss(blockName, newBlockName);

  // UPDATE MODEL.JSON
  const modelFileFullPath = path.join(new_block_path, 'model.json');
  try {
    updateModelJson(modelFileFullPath, newBlockName);
  } catch (err) {
    console.log(chalk.red(err));
    console.log('\n');
  }

  // import _editor.scss if exists
  const _new_editor_scss_path = path.join(
    theme_root_dir,
    blocksDirPath,
    newBlockName,
    '_editor.scss'
  );

  // TODO: Maybe create a util fn and use here and elsewhere
  const _editor_scss_exists = fs.existsSync(_new_editor_scss_path);
  if (_editor_scss_exists) {
    const handleEditorScssImport = handleEditorScss();
    const scss_backend_includes_arr = handleEditorScssImport.read();
    const newBlockEditorScssImport = `@import '../blocks/${newBlockName}/_editor';`;
    if (!scss_backend_includes_arr.includes(newBlockEditorScssImport)) {
      scss_backend_includes_arr.push(newBlockEditorScssImport);
      handleEditorScssImport.write(scss_backend_includes_arr);
    } else {
      console.log(
        `${chalk.yellow(
          `Couldn't import the _editor.scss file. Please check the _editor.scss imports file. (Maybe it has already been imported)`
        )}\n`
      );
    }
  }

  // Copy compiled css and js if they exists for the block to be copied
  // blocksFrontEndProdDir
  const block_compiled_css_and_js_path = path.join(
    theme_root_dir,
    blocksFrontEndProdDir,
    blockName
  );
  if (fs.existsSync(block_compiled_css_and_js_path)) {
    const new_block_compiled_css_and_js_path = path.join(
      theme_root_dir,
      blocksFrontEndProdDir,
      newBlockName
    );

    const compiled_css_and_js_options = {
      templateDirectory: block_compiled_css_and_js_path,
      targetDirectory: new_block_compiled_css_and_js_path,
    };
    await copyTemplateFiles(compiled_css_and_js_options);
  }

  // import into blocks_array.json
  const handleBlocksJsonImport = handleBlocksArr();
  const blocks_object = handleBlocksJsonImport.read();
  const blocks_array = blocks_object.blocks_array;
  if (!blocks_array.includes(newBlockName)) {
    blocks_array.push(newBlockName);
    try {
      handleBlocksJsonImport.write(blocks_object);
    } catch (err) {
      console.log(chalk.red(err));
      console.log('\n');
    }
  } else {
    console.log(
      chalk.yellow(
        `Couldn't import into blocks_array.json file. (Maybe it has already been imported)`
      )
    );
  }

  // TODO: Write docs that these files shouldn't be removed
  console.log(
    chalk.green(
      `Block "${blockName}" successfully copied and renamed into "${newBlockName}"\n`
    )
  );
}

export default copyBlock;
