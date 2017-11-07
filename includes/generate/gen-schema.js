'use strict';

//
// Required libraries.
const chalk = require('chalk');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const twig = require('twig');

//
// Required internal libraries.
const tools = require('../tools');

const { expandCommand, outputCommandResults, strToClassName } = tools;

class GenSchema {
    //
    // Public methods.
    generate({ name, program }, callback) {
        let error = '';

        const destination = path.join(process.cwd(), 'schemas', `${name}.schema.js`);

        console.log(chalk.green(`Generating schema '${name}'...`));
        if (!error && !fs.existsSync(destination)) {
            const variables = {
                name,
                className: strToClassName(name)
            };
            twig.renderFile(path.join(__dirname, 'templates', 'schema.js.twig'), variables, (err, contents) => {
                if (err) {
                    callback(err);
                } else {
                    fs.writeFileSync(destination, contents);
                    console.log(`Schema '${name}' generated at '${destination}'`);

                    if (program.provider) {
                        this._generateProvider({ name, variables }, callback);
                    } else {
                        callback();
                    }
                }
            });
        } else {
            error = `Path ${destination} already exists.`;
        }

        if (error) {
            callback(error);
        }
    }

    //
    // Protected methods.
    _generateProvider(params, callback) {
        const curDir = process.cwd();

        let steps = [
            this._generateProviderStep1,
            this._generateProviderStep2,
            this._generateProviderStep3,
            this._generateProviderStep4,
            this._generateProviderStep5,
            this._generateProviderStep6
        ];

        const runIt = error => {
            process.chdir(curDir);

            if (error) {
                callback(error);
            } else {
                if (steps.length > 0) {
                    const current = steps.shift();

                    process.chdir(path.join(curDir, 'client'));
                    current(params, runIt);
                } else {
                    callback();
                }
            }
        };
        runIt(false);
    }
    _generateProviderStep1({ name }, callback) {
        let error = '';

        console.log(chalk.green(`Creating service...`));

        const results = childProcess.spawnSync(expandCommand('ng'), [
            'generate',
            'service',
            `providers/${name}`
        ]);

        if (outputCommandResults(results)) {
            error = `There was a problem cloning.`;
        }

        callback(error);
    }
    _generateProviderStep2({ name, variables }, callback) {
        console.log(chalk.green(`Updating service code...`));

        const destination = path.join(process.cwd(), `src/app/providers/${name}.service.ts`);

        twig.renderFile(path.join(__dirname, 'templates', 'schema.service.ts.twig'), variables, (err, contents) => {
            if (err) {
                callback(err);
            } else {
                fs.writeFileSync(destination, contents);
                console.log(`Code updated (at '${destination}')`);
                callback();
            }
        });
    }
    _generateProviderStep3({ name, variables }, callback) {
        let error = '';

        console.log(chalk.green(`Creating component...`));

        const results = childProcess.spawnSync(expandCommand('ng'), [
            'generate',
            'component',
            `${name}-crud`
        ]);

        if (outputCommandResults(results)) {
            error = `There was a problem cloning.`;
        }

        callback(error);
    }
    _generateProviderStep4({ name, variables }, callback) {
        console.log(chalk.green(`Updating component code...`));

        const destination = path.join(process.cwd(), `src/app/${name}-crud/${name}-crud.component.ts`);

        twig.renderFile(path.join(__dirname, 'templates', 'schema.component.ts.twig'), variables, (err, contents) => {
            if (err) {
                callback(err);
            } else {
                fs.writeFileSync(destination, contents);
                console.log(`Code updated (at '${destination}')`);
                callback();
            }
        });
    }
    _generateProviderStep5({ name, variables }, callback) {
        console.log(chalk.green(`Updating component's template code...`));

        const destination = path.join(process.cwd(), `src/app/${name}-crud/${name}-crud.component.html`);

        twig.renderFile(path.join(__dirname, 'templates', 'schema.component.html.twig'), variables, (err, contents) => {
            if (err) {
                callback(err);
            } else {
                fs.writeFileSync(destination, contents);
                console.log(`Code updated (at '${destination}')`);
                callback();
            }
        });
    }
    _generateProviderStep6({ name, variables }, callback) {
        let error = '';

        console.log(chalk.green(`Updating routes...`));

        const destination = path.join(process.cwd(), `src/app/app.routes.ts`);

        let code = fs.readFileSync(destination).toString();

        const preLines = {
            a: `    { path: '${variables.name}', component: ${variables.className}CrudComponent },`
        };
        const postLines = {
            b: `import { ${variables.className}CrudComponent } from './${variables.name}-crud/${variables.name}-crud.component';`
        };
        const pats = {
            a: /\{ path: '\*\*', component: NotFoundComponent \}/,
            b: /import \{ NotFoundComponent \} from \'\.\/not-found\/not-found\.component\';/
        };

        //
        // Ignoring known lines.
        for (let k in preLines) {
            if (code.indexOf(preLines[k]) > -1) {
                delete preLines[k];
            }
        }
        for (let k in postLines) {
            if (code.indexOf(postLines[k]) > -1) {
                delete postLines[k];
            }
        }

        //
        // Adding new content.
        let contents = [];
        code = code.split('\n');
        if (Object.keys(preLines).length > 0 || Object.keys(postLines).length > 0) {
            for (let i in code) {
                for (let k in preLines) {
                    if (code[i].match(pats[k])) {
                        contents.push(preLines[k]);
                        break;
                    }
                }

                contents.push(code[i]);

                for (let k in postLines) {
                    if (code[i].match(pats[k])) {
                        contents.push(postLines[k]);
                        break;
                    }
                }
            }
        } else {
            contents = code;
        }

        fs.writeFileSync(destination, contents.join('\n'));
        console.log(`Code updated (at '${destination}')`);

        callback(error);
    }
};

const instance = new GenSchema();

module.exports = instance;