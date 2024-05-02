#!/bin/bash

CRAWLED_FILE=$1
FIRST=true
echo "["
while IFS= read -r line
do
    if $FIRST
    then
        FIRST=false
    else
        echo ","
    fi
    node parse.js --line "$line"
done < $CRAWLED_FILE
echo "]"
