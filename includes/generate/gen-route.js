'use strict';

//
// Required libraries.
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const twig = require('twig');

class GenRoute {
    generate(name, params, callback) {
        const destination = path.join(process.cwd(), 'routes', `${name}.route.js`);

        console.log(`Generating route '${name}'...`);
        if (!fs.existsSync(destination)) {
            twig.renderFile(path.join(__dirname, 'templates', 'route.js.twig'), { name }, (err, contents) => {
                if (err) {
                    callback(err);
                } else {
                    fs.writeFileSync(destination, contents);
                    console.log(`Route '${name}' generated at '${destination}'`);
                    callback();
                }
            });
        } else {
            callback(`Path ${destination} already exists.`);
        }
    }
};

const instance = new GenRoute();

module.exports = instance;