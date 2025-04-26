# NPM Publishing Instructions for Cypress Network Monitor

This document provides step-by-step instructions for publishing the Cypress Network Monitor plugin as an npm package.

## Prerequisites

1. Create an npm account if you don't have one:
   - Go to [npmjs.com](https://www.npmjs.com/) and sign up
   - Verify your email address

2. Install npm (comes with Node.js):
   - Download and install Node.js from [nodejs.org](https://nodejs.org/)

## Preparing Your Package

1. Update the package.json file with your information:
   - Replace the placeholder author information with your details
   - Update the repository URL to point to your GitHub repository
   - Ensure the version number follows semantic versioning (e.g., 1.0.0)

2. Ensure your package structure is correct:
   - Main file: dist/cypress-network-monitor.js
   - README: dist/README.md
   - package.json properly configured

## Publishing Steps

1. Login to npm from your terminal:
   ```bash
   npm login
   ```
   Enter your npm username, password, and email when prompted.

2. Test your package locally (optional but recommended):
   ```bash
   npm pack
   ```
   This will create a tarball file (e.g., cypress-network-monitor-1.0.0.tgz) that you can inspect.

3. Publish your package:
   ```bash
   npm publish
   ```
   If this is your first time publishing this package, it will be created on npm.

4. Verify your package is published:
   - Visit https://www.npmjs.com/package/cypress-network-monitor
   - Check that all information and files are correct

## Updating Your Package

When you need to update your package:

1. Make your changes to the code
2. Update the version number in package.json following semantic versioning:
   - Patch version (1.0.x) for bug fixes
   - Minor version (1.x.0) for new features that don't break existing functionality
   - Major version (x.0.0) for breaking changes

3. Publish the new version:
   ```bash
   npm publish
   ```

## Publishing to a Scoped Package (Optional)

If you want to publish under your npm username or organization:

1. Change the package name in package.json:
   ```json
   "name": "@yourusername/cypress-network-monitor",
   ```

2. For public packages, use:
   ```bash
   npm publish --access=public
   ```

3. For private packages (requires paid npm account):
   ```bash
   npm publish --access=restricted
   ```

## Troubleshooting

- **Name already taken**: If the package name is already taken, you'll need to choose a different name or use a scoped package name.
- **Version conflict**: If you try to publish a version that already exists, you'll need to update the version number.
- **Authentication issues**: Make sure you're logged in with `npm login` and your account has the necessary permissions.
