'use strict';

/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: [process.env.NEW_RELIC_APP_NAME || 'Gaming Leaderboard API'],

  /**
   * Your New Relic license key.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,

  /**
   * This setting controls distributed tracing.
   * Distributed tracing lets you see the path that a request takes through your
   * distributed system.
   */
  distributed_tracing: {
    enabled: true
  },

  logging: {
    /**
     * Level at which to log. 'info' is usually best for production.
     * Options: 'fatal', 'error', 'warn', 'info', 'debug', 'trace'
     */
    level: 'info'
  },

  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all transactions.
   */
  allow_all_headers: true,

  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations. Allows us to
     * filter out sensitive data like cookies or auth tokens.
     */
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie',
      'response.headers.x*'
    ]
  }
};