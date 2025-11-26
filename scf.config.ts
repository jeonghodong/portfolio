/**
 * SCF Deploy Configuration
 *
 * Build directory is auto-detected (dist, build, out, etc.)
 * You can override it by adding: s3: { buildDir: './custom-dir' }
 */
import type { SCFConfig } from "scf-deploy";

const config: SCFConfig = {
  app: "portfolio",
  region: "ap-northeast-2",

  s3: {
    bucketName: "portfolio-bucket-3997426a",
    indexDocument: "index.html",
    errorDocument: "404.html",
  },

  cloudfront: {
    enabled: true,
    // SPA mode (default: true)
    // - true: Redirect 403/404 to index.html (React, Vue, Angular, etc.)
    // - false: Return default 404 error (static HTML sites that need 404 page)
    // spa: true,
    // priceClass: 'PriceClass_100',
    // Cache warming: warm up edge locations after deployment (incurs data transfer costs)
    // cacheWarming: {
    //   enabled: true,
    //   paths: ['/', '/index.html'],        // Essential paths only (avoid large files)
    //   concurrency: 3,                     // Concurrent requests (default: 3, max: 10)
    //   delay: 500,                         // Delay between requests in ms (default: 500ms)
    // },

    // Custom Domain with HTTPS (automatic SSL certificate creation)
    // Uncomment to enable custom domain with automatic SSL:
    customDomain: {
      domainName: "portfolio.jeonghodong.com",
      // certificateArn is OPTIONAL - will be auto-created if not provided
      // Requirements for auto-creation:
      //   1. Domain must be registered in Route53
      //   2. DNS validation will take 5-30 minutes
      //   3. Requires ACM and Route53 permissions
      // certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/abc-def', // Optional
    },
  },

  // Environment-specific overrides
  environments: {
    dev: {
      s3: { bucketName: "portfolio-bucket-dev-3997426a" },
      cloudfront: { enabled: false },
    },
    staging: {
      s3: { bucketName: "portfolio-bucket-staging-3997426a" },
    },
    prod: {
      s3: { bucketName: "portfolio-bucket-prod-3997426a" },
    },
  },
};

export default config;
