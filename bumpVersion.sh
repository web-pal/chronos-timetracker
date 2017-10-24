#!/bin/bash

VERSION=$1

sed -i.bak s/\"version\"\:\ \".*\"/\"version\"\:\ \"$VERSION\"/ ./package.json
sed -i.bak s/\"version\"\:\ \".*\"/\"version\"\:\ \"$VERSION\"/ ./app/package.json

rm ./package.json.bak
rm ./app/package.json.bak
