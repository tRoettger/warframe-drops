# Introduction

This repository contains a commandline to to crawl the [official warframe droptables](https://www.warframe.com/droptables).  
Furthermore it provides a command to search within the crawled content.

# Install guide

1. Install node (tested with v18.12.1)
2. Clone or download the repository
3. Execute the [update command](#update)

# Commands

## External

### search

The search command take two arguments:

1. An item (use double-quots if spaces are contained).
2. (Optional) A minimum properability (drop rate).

When called with a string for the item, this command will print all missions and rotations where this item is dropped.  
Using the second argument allows to limit this list to drop rates, which are greater or equal to the given argument.

### update

Does not take arguments.

Crawls the content from the [official warframe droptables](https://www.warframe.com/droptables).  
Parses the content to json, so the search command can use it.  
Requires an active internet connection for successfull execution.