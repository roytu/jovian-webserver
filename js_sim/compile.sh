#!/bin/sh
coffee --compile --output lib/ src/
browserify lib/app.js -o public/js/bundle.js
