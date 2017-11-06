'use strict';

//
// Required libraries.
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const twig = require('twig');

//
// Required internal libraries.
const tools = require('../tools');

class GenSchema {
    generate({ name, params, program }, callback) {
        let error = '';

        const destination = path.join(process.cwd(), 'schemas', `${name}.schema.js`);

        console.log(`Generating schema '${name}'...`);
        if (!error && !fs.existsSync(destination)) {
            const variables = {
                name,
                className: tools.strToClassName(name)
            };
            twig.renderFile(path.join(__dirname, 'templates', 'schema.js.twig'), variables, (err, contents) => {
                console.log('DEBUG PASA POR ACA');
                if (err) {
                    console.log('DEBUG error', err);
                    callback(err);
                } else {
                    fs.writeFileSync(destination, contents);
                    console.log(`Schema '${name}' generated at '${destination}'`);
                    callback();
                }
            });
        } else {
            error = `Path ${destination} already exists.`;
        }

        if (error) {
            callback(error);
        }
    }
};

const instance = new GenSchema();

module.exports = instance;