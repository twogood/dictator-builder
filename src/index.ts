#!/usr/bin/env node

import chalk from 'chalk';
const figlet = require('figlet');
import path from 'path';
import program from 'commander';
import { Logger, LEVEL } from './logging';
import dictatorBuilder from './dictatorBuilder';
import pkgUp from 'pkg-up';
const packageJsonDictatorIn = path.join(__dirname, '..', '..', '..');
const packageJsonDictatorPath = pkgUp.sync({ cwd: packageJsonDictatorIn });
if (!packageJsonDictatorPath) {
  console.log(`Unable to find package.json withing ${packageJsonDictatorIn}`);
  //This happens when testing with "npm link", so is not failing here!
}
const packageJsonDictator = packageJsonDictatorPath
  ? require(packageJsonDictatorPath)
  : {};
const description = packageJsonDictator.description
  ? packageJsonDictator.description + '. '
  : '';
console.log(
  chalk.green(
    figlet.textSync(packageJsonDictator.name, { horizontalLayout: 'full' })
  )
);
const packageJsonBuilder = require(path.join(__dirname, '..', 'package.json'));
console.log(
  `  Built with ${packageJsonBuilder.name}@${packageJsonBuilder.version}.\n` +
    `  ${packageJsonBuilder.homepage}\n`
);

program
  .version(packageJsonDictator.version)
  .description(description)
  .option(
    `-l, --logging <level>`,
    `One of ${Object.values(LEVEL)} default is ${LEVEL.INFO}.`
  )
  .option(`-d, --dry-run`, `Only show what will be done.`)
  .option(`-c, --check`, `Fail if all requirements are not fulfilled.`)
  .parse(process.argv);
const logger = new Logger(program.logging || LEVEL.INFO);

dictatorBuilder(logger, packageJsonDictatorIn);
