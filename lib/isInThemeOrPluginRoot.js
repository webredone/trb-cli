import fs from 'fs';
import {
  FILES_PATHS,
  ERROR_MSG_INCORRECT_DIR,
  VISIT_FOR_MORE_INFO,
} from '@webredone/trb-cli/CONFIG.js';

function printIncorrectDirError() {
  console.log(ERROR_MSG_INCORRECT_DIR);
  console.log(VISIT_FOR_MORE_INFO);
}

function isInThemeOrPluginRoot() {
  const cwd = process.cwd();

  const hasPackageJson = fs.existsSync(FILES_PATHS.packageJSONPath);
  const isInThemeRoot = fs.existsSync(FILES_PATHS.gutenbergDirPath['theme']);
  const isInPluginRoot = cwd.includes('/plugins/trbs-framework');

  if ((hasPackageJson && isInThemeRoot) || isInPluginRoot) {
    // Read from package.json and see if we are in the correct directory
    const pJsonObj = JSON.parse(fs.readFileSync(FILES_PATHS.packageJSONPath));

    if (['theme-redone', 'trbs-framework'].includes(pJsonObj.name)) {
      return pJsonObj.name === 'theme-redone' ? 'theme' : 'plugin';
    }
    printIncorrectDirError();
    return false;
  }
  printIncorrectDirError();
  return false;
}

export default isInThemeOrPluginRoot;
