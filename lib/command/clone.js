const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const chalk = require('chalk');
const child_process = require('child_process');
const ora = require('ora');
const { errLog } = require('../utils/utils');

const template = 'uni-app-template';
const cwd = process.cwd();

function replacePeojectName(projectName) {
  const root = path.join(cwd, projectName);
  const replaceText = (file) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (!err) {
        data = data.replace(template, projectName);
        fs.writeFile(file, data);
      }
    });
  };
  replaceText(path.join(root, 'src', 'pages.json'));
  replaceText(path.join(root, 'src', 'manifest.json'));
  replaceText(path.join(root, 'src', 'package.json'));
  fs.readFile(path.join(__dirname, '../readme.md'), 'utf-8', (err, data) => {
    if (!err) {
      fs.writeFile(path.join(root, 'README.md'), data);
    }
  });
}

module.exports.clone = async function (repo, projectName) {
  const root = path.join(cwd, projectName);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uni-app-'));
  const spinner = ora(chalk.yellow('download template...')).start();
  try {
    // 下载模板
    child_process.execSync(`git clone ${repo}`, {
      cwd: tempDir,
      stdio: 'ignore',
    });
    fs.copySync(path.join(tempDir, template), root);
    // 删除git
    fs.remove(`${root}/.git`);
    replacePeojectName(projectName);
  } catch (error) {
    spinner.stop();
    errLog(`download error ---- ${error}`);
    fs.removeSync(tempDir);
    process.exit(-1);
  } finally {
    spinner.stop();
    fs.remove(tempDir);
  }
};
