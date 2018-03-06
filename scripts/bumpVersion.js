const semver = require('semver');
const fs = require('fs');
const path = require('path');
const pjson = require('../package.json');
const pjson2 = require('../app/package.json');

const { version } = pjson;

const { argv } = process;

const releaseType = argv[2];

const validTypes = ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'];

if (!releaseType || !validTypes.includes(releaseType)) {
  console.error(`releaseType must be one of ${validTypes.join(' | ')}`);
  console.log('USAGE: bumpVersion <releaseType>');
  process.exit(1);
}

pjson.version = semver.inc(version, releaseType);
pjson2.version = semver.inc(version, releaseType);

if (argv[3] !== '--dry') {
  try {
    fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(pjson, null, 2));
  } catch (e) {
    console.error('failed to write to', path.resolve(__dirname, '../package.json'));
    process.exit(1);
  }

  try {
    fs.writeFileSync(path.resolve(__dirname, '../app/package.json'), JSON.stringify(pjson2, null, 2));
  } catch (e) {
    console.error('failed to write to', path.resolve(__dirname, '../app/package.json'));
    process.exit(1);
  }
}

console.log(pjson.version);
