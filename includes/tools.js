'use strict';

let platform = 'linux';
platform = /^win/.test(process.platform) ? 'windows' : platform;
platform = /darwin/.test(process.platform) ? 'darwin' : platform;
platform = /freebsd/.test(process.platform) ? 'freebsd' : platform;
platform = /sunos/.test(process.platform) ? 'sunos' : platform;

const expandCommandConf = {
    npm: { windows: 'npm.cmd' }
};
const expandCommand = command => {
    if (typeof expandCommandConf[command] !== 'undefined' && typeof expandCommandConf[command][platform] !== 'undefined') {
        command = expandCommandConf[command][platform];
    }

    return command;
}

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
    outputCommandResults,
    platform: () => platform
};