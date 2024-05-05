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

This command will print all missions and rotations where an item is dropped.

The search command take an item name as argument.  
Use double-quots if spaces are contained.

Additionally the optional arguments below can be used.

#### Optional arguments

| Identifier | Short | Format | Description |
| ---------- | ----- | ------ | ----------- |
| --minProp | | number | A minimum properability (drop rate). This argument allows to limit this list to drop rates, which are greater or equal to the given argument. |

### update

Does not take arguments.

Crawls the content from the [official warframe droptables](https://www.warframe.com/droptables).  
Parses the content to json, so the search command can use it.  
Requires an active internet connection for successfull execution.