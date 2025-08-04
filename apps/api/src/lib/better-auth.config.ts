/**
 * This file is used to configure the BetterAuth library.
 * It is never imported anywhere on a serverless setup.
 */

import { config } from "dotenv";
import path from "node:path";

import auth from "./auth";

// Load environment variables for development tools
config({
  path: path.resolve(__dirname, "../../.env"),
});

export default auth;
