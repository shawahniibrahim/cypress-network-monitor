#!/bin/bash

# Script to prepare and publish the Cypress Network Monitor npm package

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Preparing Cypress Network Monitor for npm publishing...${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Create dist directory if it doesn't exist
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}Creating dist directory...${NC}"
    mkdir -p dist
fi

# Copy main files to dist
echo -e "${YELLOW}Copying main files to dist directory...${NC}"
cp cypress-network-monitor.js dist/
cp README.md dist/

# Verify package.json has correct paths
echo -e "${YELLOW}Verifying package.json configuration...${NC}"
if grep -q "\"main\": \"dist/cypress-network-monitor.js\"" package.json; then
    echo -e "${GREEN}Main file path is correctly set in package.json${NC}"
else
    echo -e "${YELLOW}Updating main file path in package.json...${NC}"
    sed -i 's/"main": "cypress-network-monitor.js"/"main": "dist\/cypress-network-monitor.js"/g' package.json
fi

# Check if files array is correctly set
if grep -q "\"files\": \[\s*\"dist/cypress-network-monitor.js\",\s*\"dist/README.md\"\s*\]" package.json; then
    echo -e "${GREEN}Files array is correctly set in package.json${NC}"
else
    echo -e "${YELLOW}Please update the files array in package.json to include dist paths${NC}"
    echo -e "Example: \"files\": [\"dist/cypress-network-monitor.js\", \"dist/README.md\"]"
fi

# Remind user to update author and repository information
echo -e "${YELLOW}IMPORTANT: Before publishing, please update the following in package.json:${NC}"
echo -e "1. Author information"
echo -e "2. Repository URL"
echo -e "3. Homepage URL"
echo -e "4. Bugs URL"

# Create a dry run of the package
echo -e "\n${YELLOW}Creating a dry run of the package...${NC}"
npm pack --dry-run

echo -e "\n${GREEN}Package preparation complete!${NC}"
echo -e "${YELLOW}To publish to npm, follow these steps:${NC}"
echo -e "1. Login to npm: ${GREEN}npm login${NC}"
echo -e "2. Publish the package: ${GREEN}npm publish${NC}"
echo -e "3. Verify on npm: ${GREEN}https://www.npmjs.com/package/cypress-network-monitor${NC}"

echo -e "\n${YELLOW}For more detailed instructions, see the PUBLISHING.md file.${NC}"
