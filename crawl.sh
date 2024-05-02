#!/bin/bash

#curl https://www.warframe.com/droptables -s > $ORIGINAL_FILE

ORIGINAL_FILE=$1

IN_MISSION_TABLE=false
while IFS= read -r line
do
    if $IN_MISSION_TABLE
    then 
        if [[ "$line" =~ ^.*\/table.*$ ]]
        then
            IN_MISSION_TABLE=false
        elif ! [[ "$line" =~ ^.*table.*$ || "$line" =~ ^.*blank-row.*$ ]]
        then
            echo "$line"
        fi    
    elif [[ "$line" =~ ^.*h3.*missionRewards.*$ ]]
    then
        IN_MISSION_TABLE=true
    fi
done < $ORIGINAL_FILE