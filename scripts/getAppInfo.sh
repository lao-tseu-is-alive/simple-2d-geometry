#!/bin/bash
# This script extracts the app name and version from the source code
SRC_FILE=src/version.ts
echo "## Extracting app name and version from source"
APP_NAME=$(grep -E 'APP\s+=' $SRC_FILE| awk '{ print $5 }'  | tr -d '"')
APP_VERSION=$(grep -E 'VERSION\s+=' $SRC_FILE| awk '{ print $5 }'  | tr -d '"')
echo "## Found APP: ${APP_NAME}, VERSION: ${APP_VERSION}  in source file $SRC_FILE"
export APP_VERSION APP_NAME
