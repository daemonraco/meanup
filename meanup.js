#!/usr/bin/env node
'use strict';

const fs = require('fs');
const program = require('commander');
const path = require('path');

program.version('0.1.0');

const commandPattern = /^command\..+\.js$/;
fs.readdirSync(path.join(__dirname, 'includes'))
    .filter(x => x.match(commandPattern))
    .forEach(x => require(path.join(__dirname, `includes/${x}`))(program))

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
