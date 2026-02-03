/**
 * CORS Headers Utility
 * Common CORS headers for all Lambda functions
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

/**
 * Create a response with CORS headers
 * @param {number} statusCode - HTTP status code
 * @param {Object} body - Response body
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Lambda response object
 */
const createCorsResponse = (statusCode, body, additionalHeaders = {}) => {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      ...additionalHeaders,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
};

module.exports = {
  corsHeaders,
  createCorsResponse,
};
