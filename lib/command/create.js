const path = require('path');
const { promisify } = require('util');
const figlet = promisify(require('figlet'));
const { prompt } = require('enquirer');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const clear = require('clear');
const { clone } = require('./clone');
const { installPkg } = require('./install');
const { sucLog } = require('../utils/utils');

const cwd = process.cwd();

module.exports = async ({ projectName, ...pkgCli }) => {
  if (!projectName) {
    const res = await prompt({
      type: 'input',
      name: 'projectName',
      message: 'Project name',
    });
    projectName = res.projectName;
  }

  clear();
  const data = await figlet('Welcome');
  sucLog(data);

  const root = path.join(cwd, projectName);
  if (!fs.existsSync(root)) {
    sucLog('🚀创建项目：' + projectName);
    fs.mkdirSync(root, { recursive: true });
  } else {
    const { yes } = await prompt({
      type: 'confirm',
      name: 'yes',
      initial: true,
      message:
        `directory ${chalk.red(projectName)} is not empty.\n` +
        `Remove existing files and continue?`,
    }).catch(() => {
      process.exit(0);
    });
    if (yes) {
      const spinner = ora(chalk.yellow('removing dir...')).start();
      fs.emptyDirSync(root);
      spinner.stop();
    } else {
      return;
    }
  }

  // 暂且没用到, 只有2.0版本
  await prompt({
    type: 'select',
    name: 'v',
    message: 'Select a vue version',
    choices: [
      { value: 2, message: '2.0' },
      { value: 3, message: '3.0 暂不支持', disabled: true },
    ],
    initial: 0,
  }).catch(() => {
    process.exit(0);
  });

  await clone('https://github.com/zhaoyueer/uni-app-template.git', projectName);

  installPkg({ pkgCli, projectName });
};
