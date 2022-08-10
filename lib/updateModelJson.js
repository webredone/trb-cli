import fs from 'fs';
import snakeCaseToTitleCase from './snakeCaseToTitleCase.js';

function updateModelJson(modelFileFullPath, blockName) {
  const model_obj = JSON.parse(fs.readFileSync(modelFileFullPath));
  model_obj.block_meta.BLOCK_REGISTER_NAME = blockName;
  model_obj.block_meta.BLOCK_TITLE = snakeCaseToTitleCase(blockName, '-');

  try {
    fs.writeFileSync(
      modelFileFullPath,
      JSON.stringify(model_obj, null, 2),
      'utf8'
    );

    return true;
  } catch (err) {
    throw err;
  }
}

export default updateModelJson;
