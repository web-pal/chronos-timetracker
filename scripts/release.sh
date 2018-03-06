#!/bin/bash

releaseType=$1

node ./bumpVersion.js ${releaseType} | \
  git commit -a -m -F - && \
  conventional-changelog -p angular -i CHANGELOG.md -s -k ./app/package.json && \
  git commit -a -m 'chore: update CHANGELOG' && \
  gf release publish && \
  echo "new ${releaseType} release is ready for building!"
