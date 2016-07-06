#!/bin/bash

if [ ! -d "/www/api/node_modules" ]; then
    echo "installing dependencies"
    npm install
fi

./node_modules/.bin/db-migrate up \
    --config ./data/migration.config.json \
    -e env  \
    --migrations-dir ./data \
    --verbose

echo "running in $API_ENV mode"
node src/api.index.js
