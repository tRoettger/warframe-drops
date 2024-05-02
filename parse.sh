#!/bin/bash

CRAWLED_FILE=$1
echo "Starting node..."
while IFS= read -r line
do
    #node parse.js --line "$line"
    echo $line
done < $CRAWLED_FILE
echo "Node finished"
