import path from "path";
import { promisify } from "util";

import ncp from "ncp";
import chalk from "chalk";
import { FILES_PATHS } from "../CONFIG.js";
import handleEditorScss from "./handleEditorScss.js";
import handleBlocksArr from "./handleBlocksArr.js";
import updateModelJson from "./updateModelJson.js";
import copyEditorScss from "./copyEditorScss.js";

import isInThemeOrPluginRoot from "./isInThemeOrPluginRoot.js";

const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

async function generateNewBlock(newBlockName) {
  console.clear();

  const projType = isInThemeOrPluginRoot();

  const projectRootDir = process.cwd();

  const block_blueprint = path.join(
    projectRootDir,
    FILES_PATHS.blueprintBlockDir[projType]
  );

  const new_block_dir = path.join(
    projectRootDir,
    FILES_PATHS.blocksDirPath[projType],
    newBlockName
  );

  const options = {
    templateDirectory: block_blueprint,
    targetDirectory: new_block_dir,
  };

  // COPYING THE DIR
  await copyTemplateFiles(options);

  // RENAMING THE CLASSNAME IN THE SCSS FILE
  copyEditorScss(FILES_PATHS.blueprintBlockName[projType], newBlockName);

  // ADJUSTING MODEL.JSON
  const modelFileFullPath = path.join(new_block_dir, "model.json");

  try {
    updateModelJson(modelFileFullPath, newBlockName);
  } catch (err) {
    console.log(chalk.red(err));
    console.log("\n");
  }

  // IMPORTING _EDITOR.SCSS
  const handleEditorScssImport = handleEditorScss();
  const scss_backend_includes_arr = handleEditorScssImport.read();
  const newBlockEditorScssImport = `${FILES_PATHS.editorScss[projType]}/${newBlockName}/_editor';`;
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

  // APPENDING THE BLOCK NAME TO BLOCKS_ARRAY.JSON
  const handleBlocksJsonImport = handleBlocksArr();
  const blocks_object = handleBlocksJsonImport.read();
  const blocks_array = blocks_object.blocks_array;
  if (!blocks_array.includes(newBlockName)) {
    blocks_array.push(newBlockName);
    try {
      handleBlocksJsonImport.write(blocks_object);
    } catch (err) {
      console.log(chalk.red(err));
      console.log("\n");
    }
  } else {
    console.log(
      chalk.yellow(
        `Couldn't import into blocks_array.json file. (Maybe it has already been imported)`
      )
    );
  }

  console.log(
    chalk.green(`\nBlock ${newBlockName} has been successfully created.\n`)
  );
  console.log(chalk.yellow(`Path: ${new_block_dir}\n`));
}

export default generateNewBlock;
