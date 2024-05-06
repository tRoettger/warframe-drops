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
| &#x2011;&#x2011;blacklist | | file path | A path to a [mission list file](#mission-list-file). Results for the contained missions will be excluded. Cannot be used along with &#x2011;&#x2011;whitelist. |
| &#x2011;&#x2011;minProp | | number | A minimum properability (drop rate). This argument allows to limit this list to drop rates, which are greater or equal to the given argument. |
| &#x2011;&#x2011;whitelist | | file path | A path to a [mission list file](#mission-list-file). Only results for the contained missions will be displayed. Cannot be used along with &#x2011;&#x2011;blacklist. |

### update

Does not take arguments.

Crawls the content from the [official warframe droptables](https://www.warframe.com/droptables).  
Parses the content to json, so the search command can use it.  
Requires an active internet connection for successfull execution.

# Glossar

## Mission list file

A mission list file is a text file, which contains mission types.  
One mission type is listed per line.  
It is possible to add a rotation to the line by writing it in brackets after the mission type.

Example:

```
Defection
Defense (Rotation B)
Defense (Rotation C)
Interception
Mobile Defense
```
