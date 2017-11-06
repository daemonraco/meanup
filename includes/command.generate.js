'use strict';

//
// Required libraries.
const chalk = require('chalk');

//
// Required internal libraries.
const GenRoute = require('./generate/gen-route');
const GenSchema = require('./generate/gen-schema');
const tools = require('./tools');

module.exports = program => {
    program
        .command('generate <type> [params...]')
        .alias('g')
        .action((type, params) => {
            if (tools.isMeanDirectory()) {
                switch (type) {
                    case 'route':
                        if (params.length < 1) {
                            console.error(`Error: No route name given`);
                        } else {
                            GenRoute.generate(params[0], params, error => {
                                if (error) {
                                    console.error(chalk.red(`Error: ${error}`));
                                }
                            });
                        }
                        break;
                    case 'schema':
                        if (params.length < 1) {
                            console.error(`Error: No schema name given`);
                        } else {
                            GenSchema.generate(params[0], params, error => {
                                if (error) {
                                    console.error(chalk.red(`Error: ${error}`));
                                }
                            });
                        }
                        break;
                    default:
                        console.error(`Unknown type '${type}'`);
                }
            } else {
                console.error(`Error: Current location does not seem to be a MEAN directory.`);
            }
        });
};