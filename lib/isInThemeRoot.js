import fs from 'fs';
import {
  gutenbergDirPath,
  packageJSONPath,
  ERROR_MSG_INCORRECT_DIR,
  VISIT_FOR_MORE_INFO,
} from '../CONFIG.js';

function printIncorrectDirError() {
  console.log(ERROR_MSG_INCORRECT_DIR);
  console.log(VISIT_FOR_MORE_INFO);
}

function isInThemeRoot() {
  if (fs.existsSync(packageJSONPath) && fs.existsSync(gutenbergDirPath)) {
    // Read from package.json and see if we are in the correct directory
    const pJsonObj = JSON.parse(fs.readFileSync(packageJSONPath));

    if (pJsonObj.name === 'theme-redone') {
      return true;
    }
    printIncorrectDirError();
    return false;
  }
  printIncorrectDirError();
  return false;
}

export default isInThemeRoot;
