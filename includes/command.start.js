'use strict';

//
// Required libraries.
const chalk = require('chalk');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

//
// Required internal libraries.
const tools = require('./tools');

const { expandCommand, outputCommandResults } = tools;

module.exports = program => {
    program
        .command('start <name>')
        .description('@todo doc')
        .alias('s')
        .action((name, params) => {
            let error = false;

            const currentDir = process.cwd();
            const destination = path.join(currentDir, name);
            const clientDir = path.join(currentDir, name, 'client');
            const dirStat = fs.existsSync(destination) ? fs.statSync(destination) : null;

            if (dirStat) {
                if (!dirStat.isDirectory()) {
                    error = `Path '${destination}' exists and it's not a directory`;
                } else if (fs.readdirSync(destination).length > 0) {
                    error = `Path '${destination}' is not empty`;
                }
            }

            if (!error) {
                console.log(chalk.green(`Cloning repository...`));

                const results = childProcess.spawnSync(expandCommand('git'), [
                    'clone',
                    'https://github.com/daemonraco/mean-startup.git',
                    destination
                ]);

                if (outputCommandResults(results)) {
                    error = `There was a problem cloning.`;
                }
            }

            if (!error) {
                process.chdir(name);
                console.log(chalk.green(`Initiaizing server modules...`));

                const results = childProcess.spawnSync(expandCommand('npm'), ['install']);

                if (outputCommandResults(results)) {
                    error = `There was a problem initiaizing server modules.`;
                }
            }
            if (!error) {
                process.chdir('client');
                console.log(chalk.green(`Initiaizing client modules...`));

                const results = childProcess.spawnSync(expandCommand('npm'), ['install']);

                if (outputCommandResults(results)) {
                    error = `There was a problem initiaizing client modules.`;
                }
            }

            if (error) {
                console.error(chalk.red(`\nError: ${error}`));
            }
        });
};