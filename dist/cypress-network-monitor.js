// This file contains only the essential code needed for the npm package
// cypress-network-monitor.js
// A Cypress plugin to monitor network requests and automatically retry on 500 errors

/**
 * Configures network monitoring with auto-retry for Cypress tests
 * @param {Object} options - Configuration options
 * @param {number} options.maxRetries - Maximum number of retries per request (default: 3)
 * @param {number} options.retryDelay - Delay in ms before retrying (default: 1000)
 * @param {Array<number>} options.statusCodesToRetry - HTTP status codes that should trigger retry (default: [500])
 * @param {boolean} options.logRetries - Whether to log retry attempts (default: true)
 * @param {Function} options.onRetry - Callback function called before each retry
 * @param {Function} options.onMaxRetriesExceeded - Callback function called when max retries exceeded
 * @returns {void}
 */
function setupNetworkMonitoring(options = {}) {
  const config = {
    maxRetries: options.maxRetries || 3,
    retryDelay: options.retryDelay || 1000,
    statusCodesToRetry: options.statusCodesToRetry || [500],
    logRetries: options.logRetries !== false,
    onRetry: options.onRetry || null,
    onMaxRetriesExceeded: options.onMaxRetriesExceeded || null,
  };

  // Store retry counts for each request
  const retryCountMap = new Map();

  // Create a unique key for each request
  const getRequestKey = (req) => {
    return `${req.method}:${req.url}`;
  };

  // Reset retry counts before each test
  beforeEach(() => {
    retryCountMap.clear();
  });

  // Intercept all network requests
  cy.intercept({ times: 1000 }, (req) => {
    const requestKey = getRequestKey(req);

    // Initialize retry count if not exists
    if (!retryCountMap.has(requestKey)) {
      retryCountMap.set(requestKey, 0);
    }

    // Continue with the request and check the response
    req.continue((res) => {
      // Check if the response status code is in the list of codes to retry
      if (config.statusCodesToRetry.includes(res.statusCode)) {
        const currentRetryCount = retryCountMap.get(requestKey);
        
        // If we haven't exceeded max retries, reload the page and retry
        if (currentRetryCount < config.maxRetries) {
          // Increment retry count
          retryCountMap.set(requestKey, currentRetryCount + 1);
          
          // Log retry attempt if enabled
          if (config.logRetries) {
            cy.log(`Network request failed with status ${res.statusCode}. Retrying (${currentRetryCount + 1}/${config.maxRetries})...`);
            Cypress.log({
              name: 'network-retry',
              message: `${req.method} ${req.url} - Status: ${res.statusCode} - Retry: ${currentRetryCount + 1}/${config.maxRetries}`,
              consoleProps: () => {
                return {
                  'Request': req,
                  'Response': res,
                  'Retry Count': currentRetryCount + 1,
                  'Max Retries': config.maxRetries
                };
              }
            });
          }
          
          // Call onRetry callback if provided
          if (typeof config.onRetry === 'function') {
            config.onRetry(req, res, currentRetryCount + 1);
          }
          
          // Wait before retrying
          cy.wait(config.retryDelay).then(() => {
            // Reload the page to retry the request
            cy.reload();
          });
        } else {
          // Max retries exceeded
          if (config.logRetries) {
            cy.log(`Maximum retries (${config.maxRetries}) exceeded for request. Status: ${res.statusCode}`);
          }
          
          // Call onMaxRetriesExceeded callback if provided
          if (typeof config.onMaxRetriesExceeded === 'function') {
            config.onMaxRetriesExceeded(req, res, config.maxRetries);
          }
        }
      }
    });
  });
}

// Export the function
module.exports = { setupNetworkMonitoring };
