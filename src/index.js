'use strict';
const pkg = require('../package.json');
const chalk = require('chalk');
const { spawnSync } = require('child_process');
const { help, config } = require('./usage');

const argv = require('minimist')(process.argv.slice(2), config);
const PREFIX = chalk.yellow.bold(pkg.name);

/**
 * getMissingDeps
 * @return {[String]} list of packages
 */
function getMissingDeps() {
  const missing = [];
  const npmList= spawnSync('npm', [ 'ls', '--depth=0', '--json', ]);
  const { dependencies } = JSON.parse(npmList.stdout.toString());

  for (let depName of Object.keys(dependencies)) {
    const dep = dependencies[depName];

    if (dep.missing && dep.missing === true) {
      missing.push(depName);
    }
  }

  return missing;
}

/**
 * [logInfo description]
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
function logInfo(...args) {
  return console.log(PREFIX, chalk.dim('INFO'), ...args);
}

/**
 * [logError description]
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
function logError(...args) {
  return console.log(PREFIX, chalk.red.bold('ERR!'), chalk.red(...args));
}

/**
 * [logPackages description]
 * @param  {[type]} packages  [description]
 * @param  {String} [icon=''] [description]
 * @return {[type]}           [description]
 */
function logPackages(packages, icon = ''){
  return packages.map(pkg => console.log('├──', icon, pkg));
}

/**
 * [npmInstall description]
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
function npmInstall(...args) {
  return spawnSync('npm', ['install', '--silent', ...args], { stdio: 'inherit' });
}

if(argv.help === true) {
  console.log(help(pkg));
  process.exit(0);
}

if (argv.version === true) {
  console.log(pkg.version);
  process.exit(1);
}

const installArgs = argv._;
const missing = installArgs.length ? installArgs : getMissingDeps();
const failed = [];
const installed = [];
const batchSize = argv.batchSize;

if (missing.length) {
  logInfo('Found', missing.length, 'packages to install');
  logPackages(missing);
} else {
  logInfo('Nothing to do here.');
}

while(missing.length) {
  const batch = missing.splice(0, batchSize);
  logInfo('Attempting to install:', batch.join(', '));

  const { status } = npmInstall(...batch);
  if(status) {
    logError('Could not install batch:', batch.join(', '));

    if (batchSize == 1) {
      failed.push(...batch);
      continue;
    }

    batch.forEach(dep => {
      logInfo('Trying to install', dep);
      const { status } = npmInstall(dep);
      if (status) {
        logError('Failed to install:', dep);
        failed.push(dep);
      }
    });

  } else {
    Array.prototype.push.apply(installed, batch);
  }
}

logInfo('Installed:', installed.length, 'Failed:', failed.length);
logPackages(installed, chalk.green('\u2713'));
logPackages(failed, chalk.red('\u2717'));
process.exit( failed.length ? 1 : 0);
