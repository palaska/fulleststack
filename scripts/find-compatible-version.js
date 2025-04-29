#!/usr/bin/env node

/**
 * Script to find the highest compatible version of a package with a specific dependency version
 * Usage: node find-compatible-version.js <package-name> <dependency-name> <dependency-version>
 * Example: node find-compatible-version.js @tanstack/react-query react 18.3.1
 * Example: node find-compatible-version.js eslint-plugin-react eslint 8.57.0
 *
 * Options:
 * --all - Search all versions, not just the most recent ones
 * --timeout=<ms> - How long to search before giving up (default: 60000ms)
 *
 * CURSOR RULES:
 * 1. Version Selection Algorithm:
 *    - Sorts and groups versions by major version number
 *    - Checks each major version in descending order (newest first)
 *    - Finds the best stable (non-prerelease, non-deprecated) version for each major
 *    - Selects the overall best version based on semver comparison
 *    - For efficiency, stops searching after finding a stable version for the newest major
 *
 * 2. Pre-release Handling:
 *    - Pre-releases are tracked but not recommended by default
 *    - Shows newer pre-releases when they exist for a package
 *    - Groups and organizes pre-releases by type (alpha, beta, rc, etc.)
 *
 * 3. Output Format:
 *    - Shows the recommended version with simple installation instructions
 *    - Displays newer pre-release versions when available
 *    - Provides package.json entry for easy copying
 */

const { execSync } = require('child_process');
const semver = require('semver');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = args.filter(arg => arg.startsWith('--'));
const nonOptions = args.filter(arg => !arg.startsWith('--'));

// Validate required arguments
if (nonOptions.length < 3) {
  console.error('Usage: node find-compatible-version.js <package-name> <dependency-name> <dependency-version> [options]');
  console.error('\nOptions:');
  console.error('  --all                  Search all versions, not just recent ones');
  console.error('  --timeout=<ms>         How long to search before giving up (default: 60000ms)');
  process.exit(1);
}

const packageName = nonOptions[0];
const dependencyName = nonOptions[1];
const dependencyVersion = nonOptions[2];

// Parse options
const searchAll = options.includes('--all');
const timeoutOption = options.find(opt => opt.startsWith('--timeout='));
const timeout = timeoutOption ?
  parseInt(timeoutOption.split('=')[1], 10) : 60000; // Default 60 seconds

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const releaseDate = new Date(dateString);
  const diffMs = now - releaseDate;

  // Convert to different time units
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);

  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
};

// Format exact release date
const formatReleaseDate = (dateString) => {
  if (!dateString) return 'unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Check for blacklisted versions
const blacklistPath = path.join(__dirname, 'version-blacklist.json');
let blacklistedVersions = {};

try {
  if (fs.existsSync(blacklistPath)) {
    blacklistedVersions = JSON.parse(fs.readFileSync(blacklistPath, 'utf8'));
  }
} catch (error) {
  console.warn(`Warning: Couldn't read blacklist file: ${error.message}`);
}

const isBlacklisted = (pkgName, version) => {
  if (!blacklistedVersions[pkgName]) return false;
  return blacklistedVersions[pkgName].includes(version);
};

// Check if a version is pre-release
const isPrerelease = (version) => {
  return semver.prerelease(version) !== null ||
         /-alpha|-beta|-rc|-next|-canary|-dev|-preview|-unstable/.test(version);
};

// Get pre-release type for better display
const getPrereleaseType = (version) => {
  const prerelease = semver.prerelease(version);
  if (!prerelease) {
    if (/-alpha/.test(version)) return 'alpha';
    if (/-beta/.test(version)) return 'beta';
    if (/-rc/.test(version)) return 'rc';
    if (/-next/.test(version)) return 'next';
    if (/-canary/.test(version)) return 'canary';
    if (/-dev/.test(version)) return 'dev';
    if (/-preview/.test(version)) return 'preview';
    if (/-unstable/.test(version)) return 'unstable';
    return 'prerelease';
  }

  return prerelease[0] || 'prerelease';
};

// Set a timeout to prevent the script from running forever
const startTime = Date.now();
const checkTimeout = () => {
  if (Date.now() - startTime > timeout) {
    console.log('\n⏱️ Search timeout reached. Showing results found so far...');
    return true;
  }
  return false;
};

try {
  // Step 1: Get all versions of the package
  console.log(`🔍 Fetching all versions of ${packageName}...`);
  const allVersionsStr = execSync(`pnpm view ${packageName} versions --json`, { encoding: 'utf8' });
  const allVersions = JSON.parse(allVersionsStr);

  // Get latest release date for context
  let releaseDates = {};
  try {
    const timeStr = execSync(`pnpm view ${packageName} time --json`, { encoding: 'utf8' });
    const timeData = JSON.parse(timeStr);
    releaseDates = timeData;
  } catch (error) {
    console.log(`Note: Could not fetch release dates: ${error.message}`);
  }

  console.log(`📊 Found ${allVersions.length} versions for ${packageName}`);

  // Step 2: Sort versions by semver
  console.log(`🔢 Sorting versions...`);
  const sortedVersions = allVersions.sort((a, b) => semver.compare(b, a));

  // Step 3: Group versions by major version
  const versionsByMajor = {};
  sortedVersions.forEach(version => {
    // Skip blacklisted versions immediately
    if (isBlacklisted(packageName, version)) return;

    const major = semver.major(version);
    if (!versionsByMajor[major]) {
      versionsByMajor[major] = [];
    }
    versionsByMajor[major].push(version);
  });

  // Get sorted major versions (highest first)
  const majorVersions = Object.keys(versionsByMajor)
    .map(v => parseInt(v, 10))
    .sort((a, b) => b - a);

  console.log(`\n🧪 Starting compatibility check for ${dependencyName}@${dependencyVersion}...`);
  console.log(`📝 Using search strategy: ${searchAll ? 'comprehensive (all versions)' : 'focused (latest versions)'}`);
  console.log(`📋 Found ${majorVersions.length} major versions to check`);

  // Determine how many versions to check per major version
  const maxVersionsToCheck = searchAll ? Infinity : 20;

  // Track our results
  let bestStableVersion = null;
  const stableVersionsByMajor = {}; // Track the best stable version for each major
  let newerPrereleaseVersions = [];
  let checkedVersions = 0;

  // Check each major version, starting from the newest
  for (const majorVersion of majorVersions) {
    const versionsInMajor = versionsByMajor[majorVersion];
    const versionsToCheck = versionsInMajor.slice(0, maxVersionsToCheck);

    console.log(`\n⭐ Checking major version ${majorVersion} (${versionsToCheck.length} versions)...`);

    let foundStableForThisMajor = false;

    // Check each version in this major version
    for (const version of versionsToCheck) {
      checkedVersions++;

      // Check if we should stop due to timeout
      if (checkTimeout()) break;

      const isVersionPrerelease = isPrerelease(version);

      try {
        // Get peer dependencies for this version
        console.log(`🔍 ${packageName}@${version} ...`);
        const peerDepsStr = execSync(`pnpm view ${packageName}@${version} peerDependencies --json`, { encoding: 'utf8' });
        const peerDeps = JSON.parse(peerDepsStr || '{}');

        // Check if deprecated
        const deprecatedInfo = execSync(`pnpm view ${packageName}@${version} deprecated --json`, { encoding: 'utf8' }).trim();
        const isDeprecated = deprecatedInfo && deprecatedInfo !== 'undefined';

        // Get release date info
        const releaseDate = releaseDates && releaseDates[version]
          ? formatTimeAgo(releaseDates[version])
          : 'unknown';

        const exactReleaseDate = releaseDates && releaseDates[version]
          ? formatReleaseDate(releaseDates[version])
          : 'unknown';

        // Check if this version's peer dependencies are compatible
        if (peerDeps && peerDeps[dependencyName]) {
          const depRequirement = peerDeps[dependencyName];

          // Check if our dependency version satisfies the peer requirement
          if (semver.satisfies(dependencyVersion, depRequirement)) {
            const prereleaseType = isVersionPrerelease ? getPrereleaseType(version) : null;

            // Create version object with all details
            const compatibleVersion = {
              version,
              majorVersion,
              requirement: { [dependencyName]: depRequirement },
              deprecated: isDeprecated ? deprecatedInfo : false,
              prerelease: isVersionPrerelease,
              prereleaseType,
              releaseDate,
              exactReleaseDate
            };

            // Log the compatible version
            const versionType = isVersionPrerelease ? `prerelease (${prereleaseType})` : 'stable';
            console.log(`✅ Found compatible ${versionType} version ${version} (${dependencyName}: ${depRequirement})`);

            // If it's a stable version and not deprecated, save it
            if (!isVersionPrerelease && !isDeprecated) {
              // Save this as the best stable version for this major
              if (!stableVersionsByMajor[majorVersion] ||
                  semver.gt(version, stableVersionsByMajor[majorVersion].version)) {
                stableVersionsByMajor[majorVersion] = compatibleVersion;
              }

              // We found a stable version for this major
              foundStableForThisMajor = true;

              // If we're not in all mode, stop checking this major after finding a stable version
              if (!searchAll) {
                break;
              }
            }
            // If it's a prerelease, keep track of it
            else if (isVersionPrerelease) {
              newerPrereleaseVersions.push(compatibleVersion);
            }
          }
        }
      } catch (error) {
        // Silently ignore errors
      }
    }

    // If we found a stable version for the newest major and we're not in all mode, stop searching
    if (foundStableForThisMajor && majorVersion === majorVersions[0] && !searchAll) {
      console.log(`\n🎯 Found compatible stable version for latest major. Stopping search.`);
      break;
    }
  }

  // Now determine the best stable version across all majors
  if (Object.keys(stableVersionsByMajor).length > 0) {
    // Sort the major versions and find the highest compatible version
    const sortedMajors = Object.keys(stableVersionsByMajor)
      .map(Number)
      .sort((a, b) => b - a);

    // Default to newest major version
    bestStableVersion = stableVersionsByMajor[sortedMajors[0]];

    // Find the newest version overall using semver comparison
    for (const major of sortedMajors) {
      const versionForMajor = stableVersionsByMajor[major];
      if (!bestStableVersion || semver.gt(versionForMajor.version, bestStableVersion.version)) {
        bestStableVersion = versionForMajor;
      }
    }

    console.log(`\n🔍 Selected best version: ${bestStableVersion.version} (major ${bestStableVersion.majorVersion})`);

    // Filter prereleases to only show those newer than our best stable version
    const relevantPrereleases = newerPrereleaseVersions.filter(
      prerelease => semver.gt(prerelease.version, bestStableVersion.version)
    );

    if (relevantPrereleases.length > 0) {
      console.log(`\n📝 Found ${relevantPrereleases.length} newer prereleases available`);
      newerPrereleaseVersions = relevantPrereleases;
    } else {
      console.log(`\n📝 No prereleases newer than selected version`);
      newerPrereleaseVersions = [];
    }
  } else if (newerPrereleaseVersions.length > 0) {
    // If no stable versions found but we have prereleases, show them
    console.log(`\n📝 Found ${newerPrereleaseVersions.length} prerelease versions, but no stable versions`);
  }

  console.log(`\n✨ Checked ${checkedVersions} versions of ${packageName}`);

  // Show results based on what we found
  if (bestStableVersion) {
    console.log(`\n🎯 COMPATIBLE VERSION FOUND:`);

    // Show the best stable version
    console.log(`\n📦 Stable Version:`);
    console.log(`   • Version: ${bestStableVersion.version}`);

    const reqString = Object.entries(bestStableVersion.requirement)
      .map(([name, version]) => `${name}: ${version}`)
      .join(', ');
    console.log(`   • Dependencies: ${reqString}`);

    console.log(`   • Released: ${bestStableVersion.exactReleaseDate} (${bestStableVersion.releaseDate})`);

    // Show installation command
    console.log(`\n💻 Installation command:`);
    console.log(`   pnpm add ${packageName}@${bestStableVersion.version}`);

    // Show package.json entry
    console.log(`\n📋 Package.json entry:`);
    console.log(`   "${packageName}": "${bestStableVersion.version}"`);

    // Show newer prerelease versions if available
    if (newerPrereleaseVersions.length > 0) {
      console.log(`\n🧪 NEWER PRERELEASE VERSIONS:`);

      // Group prereleases by type
      const byType = {};
      newerPrereleaseVersions.forEach(v => {
        const type = v.prereleaseType || 'other';
        if (!byType[type]) byType[type] = [];
        byType[type].push(v);
      });

      // Show each type
      Object.keys(byType).forEach(type => {
        console.log(`\n   ${type.toUpperCase()}:`);

        // Sort by version (newest first)
        byType[type].sort((a, b) => semver.compare(b.version, a.version));

        // Show up to 3 per type
        byType[type].slice(0, 3).forEach(v => {
          const deprecatedFlag = v.deprecated ? ` ⚠️ DEPRECATED` : '';
          console.log(`   • ${v.version}${deprecatedFlag} (${v.releaseDate})`);
        });

        if (byType[type].length > 3) {
          console.log(`   • ... and ${byType[type].length - 3} more ${type} versions`);
        }
      });

      console.log(`\n⚠️ Prerelease versions may be unstable. Use for testing only.`);
    }
  } else {
    console.log(`\n❌ No compatible stable versions found for ${packageName} with ${dependencyName}@${dependencyVersion}`);

    // Check if we found any prereleases
    if (newerPrereleaseVersions.length > 0) {
      console.log(`\n🧪 PRERELEASE OPTIONS:`);

      // Sort prereleases by version (newest first)
      newerPrereleaseVersions.sort((a, b) => semver.compare(b.version, a.version));

      // Find best prerelease (non-deprecated if possible)
      const bestPrerelease = newerPrereleaseVersions.find(v => !v.deprecated) || newerPrereleaseVersions[0];

      console.log(`   • Best option: ${bestPrerelease.version} (${bestPrerelease.prereleaseType})`);

      const reqString = Object.entries(bestPrerelease.requirement)
        .map(([name, version]) => `${name}: ${version}`)
        .join(', ');
      console.log(`   • Dependencies: ${reqString}`);

      console.log(`   • Released: ${bestPrerelease.exactReleaseDate} (${bestPrerelease.releaseDate})`);

      if (bestPrerelease.deprecated) {
        console.log(`   ⚠️ WARNING: This version is deprecated: ${bestPrerelease.deprecated}`);
      }

      // Show installation command
      console.log(`\n💻 Installation command:`);
      console.log(`   pnpm add ${packageName}@${bestPrerelease.version}`);

      console.log(`\n⚠️ This is a prerelease version and may be unstable.`);
    }

    // Suggest potential solutions
    console.log(`\n💡 Suggestions:`);
    console.log(`   • Try with --all flag to search all versions`);
    console.log(`   • Check if the package has a different name pattern`);
    console.log(`   • Verify that the dependency version (${dependencyVersion}) is correct`);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
