import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import ProgressBar from 'progress';
import ora from 'ora';
import chalk from 'chalk';

// TODO: Extract into a util fn as it's reused for theme setup
async function downloadFile(url, outputPath) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const fileStream = fs.createWriteStream(outputPath);
  const contentLength = response.headers.get('content-length');
  let totalSize = parseInt(contentLength, 10);

  if (isNaN(totalSize)) {
    console.warn(
      'Warning: Size of the file is unknown. Progress bar will not be shown.'
    );
  } else {
    const progressBar = new ProgressBar('Downloading [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: totalSize,
    });

    response.body.on('data', (chunk) => {
      progressBar.tick(chunk.length);
    });
  }

  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}
// ... [other imports and functions]

async function setup_plugin() {
  // TODO: Do this in setup_theme as well
  const zipName = 'trbs-framework.zip';

  try {
    // Ensure the current working directory ends with plugins
    const pluginsEndPath = path.join('wp-content', 'plugins');
    const cwd = process.cwd();
    // TODO: Do this is setup_theme as well
    if (!cwd.endsWith(pluginsEndPath)) {
      console.log(
        chalk.red(
          '\nThis command needs to be run inside the wp-content/plugins folder.'
        )
      );
      return false;
    }

    // Check if plugin directory already exists
    const newPluginPath = path.join('.', 'trbs-framework');
    if (fs.existsSync(newPluginPath)) {
      console.log(chalk.red('\nPlugin already exists.'));
      return false;
    }

    // Fetch the latest release URL from GitHub API
    const apiUrl =
      'https://api.github.com/repos/webredone/trbs-framework-plugin/releases/latest';
    const apiResponse = await fetch(apiUrl);
    const apiData = await apiResponse.json();
    const zipUrl = apiData.zipball_url;

    // Download the zip file
    await downloadFile(zipUrl, zipName);

    // Unzip the file to a temporary directory
    const spinner = ora('Unzipping the file...').start();
    const zip = new AdmZip(zipName);
    const tempExtractPath = path.join('.', 'temp-extract');
    fs.mkdirSync(tempExtractPath, { recursive: true });
    zip.extractAllTo(tempExtractPath, true);
    spinner.succeed('Unzipping completed');

    // Determine the top-level directory name and move its contents
    const extractedFolders = fs.readdirSync(tempExtractPath);
    if (extractedFolders.length !== 1) {
      console.error(chalk.red('Unexpected structure in the zip file.'));
      return false;
    }

    const topLevelDir = path.join(tempExtractPath, extractedFolders[0]);
    fs.renameSync(topLevelDir, newPluginPath);

    // Clean up temporary directory
    fs.rmSync(tempExtractPath, { recursive: true, force: true });

    // Delete the .git directory from the new plugin folder
    const gitDirPath = path.join(newPluginPath, '.git');
    if (fs.existsSync(gitDirPath)) {
      fs.rmSync(gitDirPath, { recursive: true, force: true });
    }

    // Delete the zip file
    fs.unlinkSync(zipName);

    console.log(
      chalk.green(
        'Plugin has been set up. Please activate it from the WordPress admin panel.'
      )
    );

    // Read package.json and extract Node version
    const packageJsonPath = path.join(newPluginPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const nodeVersion = packageJson.engines.node;
      console.log(
        `Please ensure you have Node version ${nodeVersion} installed.`
      );
      console.log(
        'Then, run "npm i" and "composer i" from the plugin root directory.'
      );
    } else {
      console.log(
        chalk.yellow('Note: package.json not found in the plugin directory.')
      );
    }
  } catch (error) {
    console.error(chalk.red(`Error setting up plugin: ${error.message}`));
    return false;
  }
}

export default setup_plugin;
