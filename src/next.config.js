const withPWA = require("next-pwa");
const appConfig = require("./config");

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: false
  },
  /**
   * `serverRuntimeConfig` is available in browser code, ONLY when run on the server
   * @example
   * import getConfig from "next/config";
   * const { serverRuntimeConfig } = getConfig();
   */
  serverRuntimeConfig: {
    graphqlUrl: appConfig.INTERNAL_GRAPHQL_URL || process.env.INTERNAL_GRAPHQL_URL
  },
  /**
   * `publicRuntimeConfig` is available in browser code, even when run on the server
   * @example
   * import getConfig from "next/config";
   * const { publicRuntimeConfig } = getConfig();
   */
  publicRuntimeConfig: {
    canonicalUrl: appConfig.CANONICAL_URL || process.env.CANONICAL_URL,
    graphqlUrl: appConfig.EXTERNAL_GRAPHQL_URL || process.env.EXTERNAL_GRAPHQL_URL,
    segmentAnalytics: {
      skipMinimize: appConfig.SEGMENT_ANALYTICS_SKIP_MINIMIZE || process.env.SEGMENT_ANALYTICS_SKIP_MINIMIZE,
      writeKey: appConfig.SEGMENT_ANALYTICS_WRITE_KEY || process.env.SEGMENT_ANALYTICS_WRITE_KEY
    },
    stripePublicApiKey: appConfig.STRIPE_PUBLIC_API_KEY || process.env.SEGMENT_ANALYTICS_WRITE_KEY,
    enableSPARouting: appConfig.ENABLE_SPA_ROUTING || process.env.ENABLE_SPA_ROUTING
  },
  // NextJS builds to `/src/.next` by default. Change that to `/build/app`
  distDir: "../build/app",
  target: "serverless",
  webpack: (webpackConfig) => {
    webpackConfig.module.rules.push({
      test: /\.(gql|graphql)$/,
      loader: "graphql-tag/loader",
      exclude: ["/node_modules/", "/.next/"],
      enforce: "pre"
    });

    webpackConfig.module.rules.push({
      test: /\.mjs$/,
      type: "javascript/auto"
    });

    // Duplicate versions of the styled-components package were being loaded, this config removes the duplication.
    // It creates an alias to import the es modules version of the styled-components package.
    // This is a workaround until the root issue is resolved: https://github.com/webpack/webpack/issues/9329
    webpackConfig.resolve.alias["styled-components"] = "styled-components/dist/styled-components.browser.esm.js";

    return webpackConfig;
  }
});
