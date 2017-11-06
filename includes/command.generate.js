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
        .command('generate <type> <name>')
        .description('@todo doc')
        .alias('g')
        //.option('-n, --no-provider', 'It generates the schema, but not is counter part in Angular.')
        .action((type, name, params) => {
            if (tools.isMeanDirectory()) {
                const genParams = {
                    type,
                    name,
                    program,
                    params
                };
                switch (type) {
                    case 'route':
                        if (params.length < 1) {
                            console.error(`Error: No route name given`);
                        } else {
                            GenRoute.generate(genParams, error => {
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
                            GenSchema.generate(genParams, error => {
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