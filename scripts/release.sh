#!/bin/bash

releaseType=${1:?USAGE: yarn release <releaseType>. ('major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease')}

version=$(node ./scripts/bumpVersion.js ${releaseType} --dry)

git flow release start ${version}

node ./scripts/bumpVersion.js ${releaseType}

git commit -a -m "chore: bump version to ${version}"

conventional-changelog -p angular -i CHANGELOG.md -s -k ./app/package.json

git commit -a -m 'chore: update CHANGELOG'

git flow release publish ${version}

echo 'done!'
