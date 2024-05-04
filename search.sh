#!/bin/bash

. ./tmp/set-env.sh

ITEM=$1
MIN_PROP=$2

node search.js "$PARSED_FILE" "$ITEM" "$MIN_PROP"