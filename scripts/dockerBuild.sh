#!/bin/bash

docker run --rm -ti \
  --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
  --env ELECTRON_CACHE="/root/.cache/electron" \
  --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
  --env SENTRY_API_KEY="${SENTRY_API_KEY}:?'error: $SENTRY_API_KEY is empty'" \
  --env MIXPANEL_API_TOKEN="${MIXPANEL_API_TOKEN}:?error: $MIXPANEL_API_TOKEN is empty" \
  --env SENTRY_LINK="${SENTRY_LINK}:?error $SENTRY_LINK is empty" \
  --env GH_TOKEN="${GH_TOKEN}:?error $GH_TOKEN is empty" \
  -v ${PWD}:/project \
  -v ${PWD##*/}-node-modules:/project/node_modules \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  chronos/builder:wine
