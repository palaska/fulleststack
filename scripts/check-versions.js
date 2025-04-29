#!/usr/bin/env node

/**
 * This script checks for dependency version conflicts across the monorepo
 * It compares all package.json files against the root overrides
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read the root package.json to get overrides
const rootPackagePath = path.resolve(__dirname, '../package.json');
const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
const overrides = rootPackage.pnpm?.overrides || {};

// Get all workspace packages
const workspacePackages = JSON.parse(
  execSync('pnpm -r list --json', { encoding: 'utf8' })
);

console.log('🔍 Checking for dependency version conflicts...\n');

let hasConflicts = false;

// Check each package
workspacePackages.forEach((pkg) => {
  const packagePath = path.resolve(pkg.path, 'package.json');

  if (!fs.existsSync(packagePath)) return;

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies
  };

  // Check for conflicts with overrides
  Object.keys(overrides).forEach((dep) => {
    if (dependencies[dep] &&
        !dependencies[dep].includes(overrides[dep]) &&
        !dependencies[dep].startsWith('workspace')) {
      console.log(`⚠️ Conflict detected in ${pkg.name}:`);
      console.log(`   - ${dep}: ${dependencies[dep]} (package) vs ${overrides[dep]} (root override)`);
      hasConflicts = true;
    }
  });
});

if (!hasConflicts) {
  console.log('✅ No dependency version conflicts found!');
}
