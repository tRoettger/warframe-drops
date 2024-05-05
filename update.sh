DATE=$(date +"%Y-%m-%d_%H%M%S")
DATA_URL="https://www.warframe.com/droptables"

mkdir -p tmp

echo "#!/bin/bash" > tmp/set-env.sh
echo "" >> tmp/set-env.sh
echo "FETCHED_FILE=\"tmp/fetched-$DATE.html\"" >> tmp/set-env.sh
echo "CRAWLED_FILE=\"tmp/crawled-$DATE.txt\"" >> tmp/set-env.sh
echo "PARSED_FILE=\"tmp/parsed-$DATE.json\"" >> tmp/set-env.sh

. ./tmp/set-env.sh

echo "Fetching data from $DATA_URL"
curl "$DATA_URL" -s > "$FETCHED_FILE"
echo "Data stored at $FETCHED_FILE"

echo "Crawl relevant lines..."
./internal/crawl.sh "$FETCHED_FILE" > "$CRAWLED_FILE"
echo "Relevant lines stored at $CRAWLED_FILE"

echo "Parsing lines..."
./internal/parse.sh "$CRAWLED_FILE" > "$PARSED_FILE"
echo "Parsed output stored at $PARSED_FILE"

echo "Cleaning up..."
rm -rf "$FETCHED_FILE"
rm -rf "$CRAWLED_FILE"
echo "Removed: "
echo " - $FETCHED_FILE"
echo " - $CRAWLED_FILE"