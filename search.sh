#!/bin/bash

. ./tmp/set-env.sh

ITEM=$1
MIN_PROP=$2

node js/search.js --file "$PARSED_FILE" --item "$ITEM" "${@:2}"