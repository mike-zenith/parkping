#!/bin/bash

if [ ! -d "/www/api/node_modules" ]; then
    echo "installing dependencies"
    npm install
fi

echo "running in $API_ENV mode"
node src/api.index.js
