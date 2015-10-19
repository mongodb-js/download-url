#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
/* eslint no-sync:0 no-console:0*/
var usage = fs.readFileSync(path.resolve(__dirname, '../usage.txt')).toString();
var args = require('minimist')(process.argv.slice(2), {
  boolean: ['debug']
});

var getURL = require('../');

args.version = args._[0] || args.version || 'stable';

if (args.help || args.h) {
  console.error(usage);
  process.exit(1);
}

getURL(args, function(err, pkg) {
  if (err) {
    console.error(err);
    process.exit(1);
    return;
  }
  console.log(pkg.url);
});
