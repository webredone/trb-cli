import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
var AdmZip = require('adm-zip');
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
  const totalSize = parseInt(response.headers.get('content-length'), 10);
  const progressBar = new ProgressBar('Downloading [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 40,
    total: totalSize,
  });

  response.body.on('data', (chunk) => {
    progressBar.tick(chunk.length);
  });

  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}

export default async function setup_theme(themeName) {
  try {
    // Check if theme name is in kebab-case
    if (!isKebabCase(themeName)) {
      console.error(
        chalk.orange('Theme name must be in kebab-case (example-theme-name).')
      );
      return;
    }

    // Ensure the current working directory ends with wp-themes
    const cwd = process.cwd();
    if (!cwd.endsWith('wp-themes')) {
      console.error(
        chalk.orange('This command needs to be run inside a wp-themes folder.')
      );
      return;
    }

    // Check if theme directory already exists
    const newThemePath = path.join('.', themeName);
    if (fs.existsSync(newThemePath)) {
      console.error(chalk.orange('A theme with this name already exists.'));
      return;
    }

    // Fetch the latest release URL from GitHub API
    const apiUrl =
      'https://api.github.com/repos/webredone/theme-redone/releases/latest';
    const apiResponse = await fetch(apiUrl);
    const apiData = await apiResponse.json();
    const zipUrl = apiData.zipball_url;

    // Download the zip file
    await downloadFile(zipUrl, 'theme-redone.zip');

    // Unzip the file
    const spinner = ora('Unzipping the file...').start();
    const zip = new AdmZip('theme-redone.zip');
    zip.extractAllTo('theme-redone', true); // Extract to current directory
    spinner.succeed('Unzipping completed');

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
      'Theme has been set up. Please activate the theme from the WordPress admin panel.'
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
    console.error(chalk.orange(`Error setting up theme: ${error.message}`));
  }
}
