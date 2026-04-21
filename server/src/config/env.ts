import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.SERVER_PORT || "4000",
  NODE_ENV: process.env.NODE_ENV || "development",

  COPILOT_API_KEY: process.env.COPILOT_API_KEY || "",
  COPILOT_ORG_ID: process.env.COPILOT_ORG_ID || "",

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",

  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || "",
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || "",
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "",
  S3_REGION: process.env.S3_REGION || "",

  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",

  // CDN for theme ZIPs
  CDN_URL: process.env.CDN_URL || "",

  // Copilot AI backend endpoint
  COPILOT_API_URL:
    process.env.COPILOT_API_URL ||
    "https://api.copilot.microsoft.com/v1/code"
};
