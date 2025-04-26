# Cypress Network Monitor

A Cypress plugin that monitors network requests and automatically retries tests when 500 errors are detected.

## Features

- 🔍 Monitors all network requests in your Cypress tests
- 🔄 Automatically retries when 500 errors (or other configurable status codes) are detected
- ⚙️ Highly configurable with options for retry limits, delays, and status codes
- 📊 Detailed logging of retry attempts
- 🪝 Custom callback hooks for retry events
- 🧪 Works with any Cypress test without modifying test code

## Installation

```bash
# Using npm
npm install cypress-network-monitor --save-dev

# Using yarn
yarn add cypress-network-monitor --dev
```

## Quick Start

1. Import the plugin in your Cypress support file:

```javascript
// In cypress/support/e2e.js or cypress/support/index.js
const { setupNetworkMonitoring } = require('cypress-network-monitor');

// Set up with default options
setupNetworkMonitoring();
```

2. That's it! Your tests will now automatically retry when they encounter 500 errors.

## Configuration Options

The `setupNetworkMonitoring` function accepts a configuration object with the following options:

```javascript
setupNetworkMonitoring({
  // Maximum number of retries per request
  maxRetries: 3,
  
  // Delay in milliseconds before retrying
  retryDelay: 1000,
  
  // HTTP status codes that should trigger retry
  statusCodesToRetry: [500],
  
  // Whether to log retry attempts
  logRetries: true,
  
  // Callback function called before each retry
  onRetry: (req, res, retryCount) => {
    console.log(`Retrying ${req.method} ${req.url} (Attempt ${retryCount})`);
  },
  
  // Callback function called when max retries exceeded
  onMaxRetriesExceeded: (req, res, maxRetries) => {
    console.log(`Max retries (${maxRetries}) exceeded for ${req.method} ${req.url}`);
  }
});
```

### Default Configuration

If no configuration is provided, the following defaults are used:

- `maxRetries`: 3
- `retryDelay`: 1000 (1 second)
- `statusCodesToRetry`: [500]
- `logRetries`: true
- `onRetry`: null
- `onMaxRetriesExceeded`: null

## Usage Examples

### Basic Usage

```javascript
// In cypress/support/e2e.js
const { setupNetworkMonitoring } = require('cypress-network-monitor');

// Set up with default options
setupNetworkMonitoring();
```

### Custom Configuration

```javascript
// In cypress/support/e2e.js
const { setupNetworkMonitoring } = require('cypress-network-monitor');

// Set up with custom options
setupNetworkMonitoring({
  maxRetries: 2,
  retryDelay: 500,
  statusCodesToRetry: [500, 503, 504],
  logRetries: true
});
```

### Using in Specific Tests Only

```javascript
// In your test file
const { setupNetworkMonitoring } = require('cypress-network-monitor');

describe('Feature with flaky API', () => {
  beforeEach(() => {
    // Set up monitoring only for this test suite
    setupNetworkMonitoring({
      maxRetries: 2,
      statusCodesToRetry: [500]
    });
    
    cy.visit('/feature-page');
  });
  
  it('should load data correctly', () => {
    // Test will automatically retry if API returns 500
    cy.get('#load-data-button').click();
    cy.get('.data-container').should('be.visible');
  });
});
```

## License

MIT
