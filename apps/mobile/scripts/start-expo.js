#!/usr/bin/env node

/**
 * This script starts the Expo app with the API URL set to the local IP address.
 * It does the following:
 * 1. Gets the local IP address using ifconfig
 * 2. Updates the .env file in the mobile app directory with the correct API URL
 * 3. Starts the Expo app using `npx expo start`
 */

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

// Get the directory of the mobile app
const mobileAppDir = path.resolve(__dirname, "..");

// Function to get the local IP address
function getLocalIP() {
  try {
    // Run ifconfig and extract the IP address
    const ifconfigOutput = execSync("ifconfig en0").toString();
    const ipMatch = ifconfigOutput.match(/inet\s+(\d+\.\d+\.\d+\.\d+)/);

    if (ipMatch && ipMatch[1]) {
      return ipMatch[1];
    }
    else {
      console.error("❌ Could not find IP address in ifconfig output.");
      console.log("Using fallback IP: 127.0.0.1");
      return "127.0.0.1";
    }
  }
  catch (error) {
    console.error(`❌ Error getting local IP: ${error.message}`);
    console.log("Using fallback IP: 127.0.0.1");
    return "127.0.0.1";
  }
}

// Function to update the .env file
function updateEnvFile(ip) {
  const envPath = path.join(mobileAppDir, ".env");
  const apiUrl = `http://${ip}:8787`;

  try {
    // Check if .env file exists
    let envContent = "";

    if (fs.existsSync(envPath)) {
      // Read existing content
      envContent = fs.readFileSync(envPath, "utf8");

      // Replace or add EXPO_PUBLIC_API_URL
      if (envContent.includes("EXPO_PUBLIC_API_URL=")) {
        envContent = envContent.replace(
          /EXPO_PUBLIC_API_URL=.*/,
          `EXPO_PUBLIC_API_URL=${apiUrl}`,
        );
      }
      else {
        envContent += `\nEXPO_PUBLIC_API_URL=${apiUrl}\n`;
      }
    }
    else {
      // Create new .env file
      envContent = `EXPO_PUBLIC_API_URL=${apiUrl}\n`;
    }

    // Write the updated content
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ .env file updated with API URL: ${apiUrl}`);
  }
  catch (error) {
    console.error(`❌ Error updating .env file: ${error.message}`);
    process.exit(1);
  }
}

// Function to start the Expo app
function startExpo() {
  try {
    console.log("🚀 Starting Expo app...");
    // Run in the same process to show output and allow user to interact with Expo CLI
    execSync("npx expo start", {
      cwd: mobileAppDir,
      stdio: "inherit",
    });
  }
  catch (error) {
    console.error(`❌ Error starting Expo app: ${error.message}`);
    process.exit(1);
  }
}

// Main function
function main() {
  console.log("📱 Setting up Expo app...");

  // Get local IP
  const localIP = getLocalIP();
  console.log(`📡 Local IP: ${localIP}`);

  // Update .env file
  updateEnvFile(localIP);

  // Start Expo
  startExpo();
}

// Run the script
main();
