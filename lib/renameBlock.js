import fs from "fs";
import path from "path";

import chalk from "chalk";

import { FILES_PATHS } from "../CONFIG.js";
import updateModelJson from "./updateModelJson.js";
import handleEditorScss from "./handleEditorScss.js";
import handleBlocksArr from "./handleBlocksArr.js";
import { updateEditorScss } from "./copyEditorScss.js";

import isInThemeOrPluginRoot from "./isInThemeOrPluginRoot.js";

function renameBlock(blockName, newBlockName) {
  console.clear();

  const projType = isInThemeOrPluginRoot();

  // Rename folder name
  const projectRootDir = process.cwd();
  const blockFullPath = path.join(
    projectRootDir,
    FILES_PATHS.blocksDirPath[projType],
    blockName
  );
  const newBlockFullPath = path.join(
    projectRootDir,
    FILES_PATHS.blocksDirPath[projType],
    newBlockName
  );

  try {
    fs.renameSync(blockFullPath, newBlockFullPath);
  } catch (err) {
    console.log(chalk.red(err));
    console.log("\n");
  }

  // Rename meta in model.json
  const modelFileFullPath = path.join(newBlockFullPath, "model.json");
  try {
    updateModelJson(modelFileFullPath, newBlockName);
  } catch (err) {
    console.log(chalk.red(err));
    console.log("\n");
  }

  // Rename _editor.scss content
  // TODO: Fix this. It should copy existing styles. Now it overwrites
  const _editor_scss_path = path.join(newBlockFullPath, "_editor.scss");
  if (fs.existsSync(_editor_scss_path)) {
    updateEditorScss(_editor_scss_path, blockName, newBlockName);
  }

  // Rename _editor import
  const handleEditorScssImport = handleEditorScss();
  const scss_backend_includes_arr = handleEditorScssImport.read();
  const oldBlockEditorScssImport = `${FILES_PATHS.editorScss[projType]}/${blockName}/_editor';`;
  const newBlockEditorScssImport = `${FILES_PATHS.editorScss[projType]}/${newBlockName}/_editor';`;
  if (scss_backend_includes_arr.includes(oldBlockEditorScssImport)) {
    let updated_scss_backend_includes_arr = scss_backend_includes_arr.filter(
      (line) => line !== oldBlockEditorScssImport
    );

    if (!scss_backend_includes_arr.includes(newBlockEditorScssImport)) {
      updated_scss_backend_includes_arr.push(newBlockEditorScssImport);
    }

    try {
      handleEditorScssImport.write(updated_scss_backend_includes_arr);
    } catch (err) {
      console.log(chalk.red(err));
      console.log("\n");
    }
  }

  // If compiled block's frontend.min.css and frontend.min.js exist
  // in the prod/block-specific/[block-name] dir
  // rename the block's name in prod dir/block-specific/
  const block_compiled_css_and_js_path = path.join(
    projectRootDir,
    FILES_PATHS.blocksFrontEndProdDir[projType],
    blockName
  );

  if (fs.existsSync(block_compiled_css_and_js_path)) {
    const renamed_block_compiled_css_and_js_path = path.join(
      projectRootDir,
      FILES_PATHS.blocksFrontEndProdDir[projType],
      newBlockName
    );

    try {
      fs.renameSync(
        block_compiled_css_and_js_path,
        renamed_block_compiled_css_and_js_path
      );
    } catch (err) {
      console.log(chalk.red(err));
      console.log("\n");
    }
  }

  // Rename blocks_array.json import
  const handleBlocksJsonImport = handleBlocksArr();
  const blocks_object = handleBlocksJsonImport.read();
  const blocks_array = blocks_object.blocks_array;
  if (blocks_array.includes(blockName)) {
    let updated_blocks_array = blocks_array.filter(
      (line) => line !== blockName
    );

    if (!blocks_array.includes(newBlockName)) {
      updated_blocks_array.push(newBlockName);
    }

    blocks_object.blocks_array = updated_blocks_array;
    try {
      handleBlocksJsonImport.write(blocks_object);
    } catch (err) {
      console.log(chalk.red(err));
      console.log("\n");
    }
  }

  console.log(
    chalk.green(
      `\nSuccessfully renamed the block "${blockName}" to "${newBlockName}"\n`
    )
  );
}

export default renameBlock;
