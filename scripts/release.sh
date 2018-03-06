#!/bin/bash

releaseType=$1

node ./bumpVersion.js ${releaseType} |
  git commit -a -m ''
