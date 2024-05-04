DATE=$(date +"%Y-%m-%d_%H%M%S")
DATA_URL="https://www.warframe.com/droptables"

echo "FETCHED_FILE=\"tmp/fetched-$DATE.html\"" > set-env.sh
echo "CRAWLED_FILE=\"tmp/crawled-$DATE.txt\"" >> set-env.sh
echo "PARSED_FILE=\"tmp/parsed-$DATE.json\"" >> set-env.sh

. ./set-env.sh

echo "Fetching data from $DATA_URL"
curl "$DATA_URL" -s > "$FETCHED_FILE"
echo "Data stored at $FETCHED_FILE"

echo "Crawl relevant lines..."
./crawl.sh "$FETCHED_FILE" > "$CRAWLED_FILE"
echo "Relevant lines stored at $CRAWLED_FILE"

echo "Parsing lines..."
./parse.sh "$CRAWLED_FILE" > "$PARSED_FILE"
echo "Parsed output stored at $PARSED_FILE"

echo "Cleaning up..."
rm -rf "$FETCHED_FILE"
rm -rf "$CRAWLED_FILE"
echo "Removed: "
echo " - $FETCHED_FILE"
echo " - $CRAWLED_FILE"