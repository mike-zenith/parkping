#!/bin/bash

if [ ! -d "/www/api/node_modules" ]; then
    echo "installing dependencies"
    npm install
fi

echo "running in $ENVIRONMENT mode"
node /www/api/src/api.index.js
