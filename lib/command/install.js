const child_process = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const { errLog } = require('../utils/utils');

const cwd = process.cwd();

const spawnPromify = async (...args) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(...args);
    // 日志是个流
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

const valdateCli = (cli) => {
  return new Promise((resolve) => {
    child_process.exec(`${cli} --version`, (error) => {
      if (error) {
        resolve(false);
      }
      resolve(true);
    });
  });
};

/**
 * 安装npm包
 */
module.exports.installPkg = async function ({ pkgCli, projectName }) {
  let cli = 'yarn';
  let args = [];
  if (pkgCli.useNpm) {
    cli = 'npm';
    args = ['install'];
  } else if (pkgCli.usePnpm) {
    cli = 'pnpm';
    args = ['install'];
  }
  const pass = await valdateCli(cli);
  if (!pass) {
    errLog(`${cli} command is not found`);
    process.exit(0);
  }

  const spinner = ora(chalk.yellow('installing pkg...')).start();

  fs.removeSync(path.join(cwd, 'yarn.lock'));
  await spawnPromify(cli, args, {
    cwd: path.join(cwd, projectName),
    stdio: 'inherit',
  })
    .then(() => {
      spinner.succeed('install complete');
    })
    .catch(() => {
      spinner.fail('install failed, please install manual');
    });
};
