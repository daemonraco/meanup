'use strict';

//
// Required libraries.
const fs = require('fs');

//
// Guessing current platform @{
let platform = 'linux';
platform = /^win/.test(process.platform) ? 'windows' : platform;
platform = /darwin/.test(process.platform) ? 'darwin' : platform;
platform = /freebsd/.test(process.platform) ? 'freebsd' : platform;
platform = /sunos/.test(process.platform) ? 'sunos' : platform;
// @}

//
// Adapting commands depending on current platform @{
const expandCommandConf = {
    npm: { windows: 'npm.cmd' }
};
const expandCommand = command => {
    if (typeof expandCommandConf[command] !== 'undefined' && typeof expandCommandConf[command][platform] !== 'undefined') {
        command = expandCommandConf[command][platform];
    }

    return command;
}
//@}

//
// Checks if current working directory has the required elements to be considered
// a MEAN directory.
const isMeanDirectory = () => {
    let itIs = true;

    const entries = fs.readdirSync(process.cwd());
    const leftOvers = [
        'assets',
        'assets-by-env',
        'client',
        'configs',
        'includes',
        'public',
        'routes',
        'server.js'
    ].filter(x => entries.indexOf(x) == -1);
    itIs = leftOvers.length == 0;

    return itIs;
};

const strToClassName = str => str.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(/ /g, '');

//
// @todo doc
const outputCommandResults = results => {
    let hasError = false;

    if (results.status === null) {
        console.error(chalk.red(`${results.error}`));
        hasError = true;
    } else if (results.status === 0) {
        console.log(results.stdout.toString());
    } else {
        console.error(chalk.red(`\nError: ${results.stderr.toString()}`));
        hasError = true;
    }

    return hasError;
};

module.exports = {
    expandCommand,
    isMeanDirectory,
    outputCommandResults,
    strToClassName,
    platform: () => platform
};