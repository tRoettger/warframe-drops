#!/bin/bash

PARSED_FILE=$1
ITEM=$2
MIN_PROP=$3

node search.js "$PARSED_FILE" "$ITEM" "$MIN_PROP"