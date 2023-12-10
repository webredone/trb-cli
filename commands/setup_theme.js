import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import AdmZip from 'adm-zip';
import ProgressBar from 'progress';
import ora from 'ora';
import chalk from 'chalk';

function isKebabCase(str) {
  return /^[a-z]+(-[a-z]+)*$/.test(str);
}

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

async function setup_theme(themeName) {
  try {
    // Check if theme name is in kebab-case
    if (!isKebabCase(themeName)) {
      console.log(
        chalk.red('\nTheme name must be in kebab-case (example-theme-name')
      );
      return false;
    }

    // Ensure the current working directory ends themes
    const cwd = process.cwd();
    if (!cwd.endsWith('wp-content/themes')) {
      console.log(
        chalk.red('\nThis command needs to be run inside a wp-themes folder.')
      );
      return false;
    }

    // Check if theme directory already exists
    const newThemePath = path.join('.', themeName);
    if (fs.existsSync(newThemePath)) {
      console.log(chalk.red('\nTA theme with this name already exists.'));
      return false;
    }

    // Fetch the latest release URL from GitHub API
    const apiUrl =
      'https://api.github.com/repos/webredone/theme-redone/releases/latest';
    const apiResponse = await fetch(apiUrl);
    const apiData = await apiResponse.json();
    const zipUrl = apiData.zipball_url;

    // Download the zip file
    await downloadFile(zipUrl, 'theme-redone.zip');

    // Unzip the file to a temporary directory
    const spinner = ora('Unzipping the file...').start();
    const zip = new AdmZip('theme-redone.zip');
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
    fs.renameSync(topLevelDir, newThemePath);

    // Clean up temporary directory
    fs.rmdirSync(tempExtractPath, { recursive: true });

    // Delete the .git directory from the new theme folder
    const gitDirPath = path.join(newThemePath, '.git');
    if (fs.existsSync(gitDirPath)) {
      fs.rmSync(gitDirPath, { recursive: true, force: true });
    }

    // Rename the extracted folder
    // Note: You need to adjust the logic here to determine the correct extracted folder name
    spinner.start('Renaming the folder...');
    const extractedFolderName = 'theme-redone'; // Placeholder, replace with actual logic
    fs.renameSync(extractedFolderName, newThemePath);
    spinner.succeed('Renaming completed');

    // Modify style.css in the theme folder
    const styleCssPath = path.join(newThemePath, 'style.css');
    let styleCss = fs.readFileSync(styleCssPath, 'utf8');
    styleCss = styleCss.replace(
      /Theme Name: theme-redone/g,
      `Theme Name: ${themeName}`
    );
    fs.writeFileSync(styleCssPath, styleCss);

    // Delete the zip file
    fs.unlinkSync('theme-redone.zip');

    console.log(
      chalk.green(
        'Theme has been set up. Please activate the theme from the WordPress admin panel.'
      )
    );

    // Read package.json and extract Node version
    const packageJsonPath = path.join(newThemePath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const nodeVersion = packageJson.engines.node;

    console.log(
      `Please ensure you have Node version ${nodeVersion} installed.`
    );
    console.log(
      'Then, run "npm i" and "composer i" from the theme root directory.'
    );
  } catch (error) {
    console.error(chalk.red(`Error setting up theme: ${error.message}`));
    return false;
  }
}

export default setup_theme;
