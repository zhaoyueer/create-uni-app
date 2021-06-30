const chalk = require('chalk');
const child_process = require('child_process');
const semver = require('semver');
const {
  name,
  engines: { node: requiredVersion },
} = require('../../package.json');

const errLog = (content) => console.log(chalk.red(content));
const sucLog = (content) => console.log(chalk.green(content));

/**
 * 检测最新版本
 * @param {string}} version 当前版本
 */
function checkLatestVersion(version) {
  let v;
  try {
    v = child_process.execSync(`npm view ${name} version`).toString().trim();
  } catch (e) {}
  if (v && semver.lt(version, v)) {
    console.log(
      chalk.yellow(
        `You are running \`create-uni-app\` ${version}, which is behind the latest release (${v}).\n` +
          'please upgrade your pkg for use new feature',
      ),
    );
  }
}

/**
 * 检查node版本
 */
function checkNodeVersion() {
  if (
    !semver.satisfies(process.version, requiredVersion, {
      includePrerelease: true,
    })
  ) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}, but create-uni-app ` +
          `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`,
      ),
    );
    process.exit(1);
  }
}

module.exports = {
  errLog,
  sucLog,
  checkLatestVersion,
  checkNodeVersion,
};
