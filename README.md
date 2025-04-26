# Cypress Network Monitor with Auto-Retry

A Cypress plugin that monitors network requests and automatically retries tests when 500 (or other configurable) error responses are detected.

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

1. Import the plugin in your Cypress support file or test file:

```javascript
// In cypress/support/e2e.js or cypress/support/index.js
const { setupNetworkMonitoring } = require("cypress-network-monitor");

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
    console.log(
      `Max retries (${maxRetries}) exceeded for ${req.method} ${req.url}`
    );
  },
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
const { setupNetworkMonitoring } = require("cypress-network-monitor");

// Set up with default options
setupNetworkMonitoring();
```

### Custom Configuration

```javascript
// In cypress/support/e2e.js
const { setupNetworkMonitoring } = require("cypress-network-monitor");

// Set up with custom options
setupNetworkMonitoring({
  maxRetries: 2,
  retryDelay: 500,
  statusCodesToRetry: [500, 503, 504],
  logRetries: true,
});
```

### Using in Specific Tests Only

```javascript
// In your test file
const { setupNetworkMonitoring } = require("cypress-network-monitor");

describe("Feature with flaky API", () => {
  beforeEach(() => {
    // Set up monitoring only for this test suite
    setupNetworkMonitoring({
      maxRetries: 2,
      statusCodesToRetry: [500],
    });

    cy.visit("/feature-page");
  });

  it("should load data correctly", () => {
    // Test will automatically retry if API returns 500
    cy.get("#load-data-button").click();
    cy.get(".data-container").should("be.visible");
  });
});
```

### Custom Retry Handling

```javascript
// In cypress/support/e2e.js
const { setupNetworkMonitoring } = require("cypress-network-monitor");

// Set up with custom retry handlers
setupNetworkMonitoring({
  maxRetries: 3,
  onRetry: (req, res, retryCount) => {
    // Log to Cypress and console
    cy.log(`Retrying request to ${req.url} (Attempt ${retryCount})`);

    // You could also perform custom actions before retry
    if (req.url.includes("/auth/")) {
      cy.log("Auth request failed, refreshing token before retry");
      // Custom logic to refresh auth token
    }
  },
  onMaxRetriesExceeded: (req, res, maxRetries) => {
    cy.log(`Failed after ${maxRetries} retries: ${req.method} ${req.url}`);

    // You could take screenshots or perform other actions
    cy.screenshot(`failed-after-retries-${Date.now()}`);
  },
});
```

## How It Works

The plugin uses Cypress's `cy.intercept()` to monitor all network requests. When a response with a status code matching the configured list (e.g., 500) is detected:

1. The plugin increments the retry counter for that specific request
2. If the retry count is below the maximum, it:
   - Logs the retry attempt (if enabled)
   - Calls the `onRetry` callback (if provided)
   - Waits for the configured delay
   - Reloads the page to retry the request
3. If the maximum retries are exceeded, it:
   - Logs the failure (if enabled)
   - Calls the `onMaxRetriesExceeded` callback (if provided)
   - Allows the test to continue (which may fail due to the error)

## Advanced Usage

### Handling Different Types of Errors

You can configure the plugin to handle different types of errors:

```javascript
setupNetworkMonitoring({
  statusCodesToRetry: [500, 502, 503, 504], // Handle all server errors
  maxRetries: 5, // More retries for flaky environments
  retryDelay: 2000, // Longer delay between retries
});
```

### Combining with Manual Interception

The plugin works alongside manual interception:

```javascript
// Set up automatic retry for all requests
setupNetworkMonitoring();

// In your test, you can still manually intercept specific requests
it("should handle specific API call", () => {
  // This manual interception will still work
  cy.intercept("GET", "/api/specific-data", {
    fixture: "test-data.json",
  }).as("specificData");

  cy.get("#load-button").click();
  cy.wait("@specificData");

  // Other requests will still be monitored for 500 errors
});
```

## Troubleshooting

### Retries Not Working

- Ensure the plugin is properly imported and configured in your support file
- Check that the status codes you're trying to retry are included in the `statusCodesToRetry` array
- Verify that your test is actually encountering the error status codes you expect

### Too Many Retries

If your tests are retrying too frequently:

- Reduce the `maxRetries` value
- Make sure you're only including necessary status codes in `statusCodesToRetry`
- Consider using more specific URL patterns in your test's intercepts

### Conflicts with Other Plugins

If you're using other plugins that intercept network requests:

- Initialize this plugin last to ensure it can monitor all requests
- Check for conflicts in how requests are being intercepted or modified

## License

MIT
