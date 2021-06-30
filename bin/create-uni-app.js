#!/usr/bin/env node
const program = require('commander');
const { version } = require('../package');
const create = require('../lib/command/create');
const { checkLatestVersion, checkNodeVersion } = require('../lib/utils/utils');

checkNodeVersion();
checkLatestVersion(version);

program.version(version);

program
  .command('init [project-name]')
  .description('create uni project')
  .option('--use-npm')
  .option('--use-pnpm')
  .action((projectName) => {
    const options = program.opts();
    create({
      projectName,
      useNpm: options.useNpm,
      useYarn: options.useYarn,
      usePnpm: options.usePnpm,
    });
  });

program
  .command('refresh')
  .description('refresh routers...')
  .action(require('../lib/command/refresh'));

program.parse(process.argv);
