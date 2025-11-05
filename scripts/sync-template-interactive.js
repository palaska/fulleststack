#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Interactive template synchronization script
 * Auto-detects the latest applied template commit and allows selection of new commits to apply
 */

import { execSync } from 'node:child_process';
import * as readline from 'node:readline';

const TEMPLATE_REPO_URL = 'https://github.com/palaska/fulleststack.git';
const REMOTE_NAME = 'template';
const TEMPLATE_PREFIX = '[template]';

/**
 * Execute a git command and return the output
 */
function git(command, options = {}) {
  try {
    return execSync(`git ${command}`, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : ['pipe', 'pipe', 'ignore'],
      ...options,
    }).trim();
  } catch (error) {
    if (options.ignoreError) return '';
    throw error;
  }
}

/**
 * Check if template remote is configured
 */
function checkRemoteConfigured() {
  try {
    git(`remote get-url ${REMOTE_NAME}`, { silent: true });
    return true;
  } catch {
    return false;
  }
}

/**
 * Find the last commit that was applied from the template
 * Looks for commits with [template] prefix and extracts the SHA from the commit message
 */
function findLastAppliedCommit() {
  // Get all local commits with [template] prefix
  const commits = git(
    `log --all --grep="^\\[template\\]" --format="%H|%B" -n 100`,
    { silent: true, ignoreError: true }
  );

  if (!commits) return null;

  // Parse commits and extract source SHA
  const lines = commits.split('\n');
  const commitMessages = [];
  let currentCommit = null;
  let currentMessage = '';

  for (const line of lines) {
    if (line.includes('|')) {
      if (currentCommit) {
        commitMessages.push({ hash: currentCommit, message: currentMessage });
      }
      const [hash, ...rest] = line.split('|');
      currentCommit = hash;
      currentMessage = rest.join('|');
    } else {
      currentMessage += `\n${line}`;
    }
  }

  if (currentCommit) {
    commitMessages.push({ hash: currentCommit, message: currentMessage });
  }

  // Find the most recent commit with a source SHA
  for (const { message } of commitMessages) {
    const sourceMatch = message.match(/Source: https:\/\/github\.com\/[^/]+\/[^/]+\/commit\/([a-f0-9]+)/);
    if (sourceMatch) {
      return sourceMatch[1];
    }
  }

  return null;
}

/**
 * Get list of available commits from template
 */
function getAvailableCommits(since = null) {
  console.log('📡 Fetching latest commits from template...');
  git(`fetch ${REMOTE_NAME} --quiet`);

  const range = since ? `${since}..${REMOTE_NAME}/master` : `${REMOTE_NAME}/master`;
  const format = '%H|%s|%an|%ar';

  const output = git(`log ${range} --oneline --no-merges --format="${format}" -50`, {
    silent: true,
    ignoreError: true,
  });

  if (!output) return [];

  return output
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [hash, subject, author, date] = line.split('|');
      return { hash, subject, author, date, selected: true }; // All selected by default
    });
}

/**
 * Display commits in an interactive selection interface
 */
async function selectCommits(commits) {
  if (commits.length === 0) {
    console.log('\n✨ No new commits available from template. You are up to date!\n');
    process.exit(0);
  }

  console.log(`\n📋 Found ${commits.length} new commit${commits.length === 1 ? '' : 's'} from template\n`);
  console.log('Use the interactive selection below:');
  console.log('  • Type commit numbers to toggle selection (e.g., "1 3 5" or "1-5")');
  console.log('  • Type "all" to select all, "none" to deselect all');
  console.log('  • Type "done" or press Enter to proceed with selected commits');
  console.log('  • Type "quit" to cancel\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function displayCommits() {
    console.log(`\n${'─'.repeat(80)}`);
    commits.forEach((commit, index) => {
      const checkbox = commit.selected ? '☑' : '☐';
      const num = String(index + 1).padStart(2);
      console.log(`${checkbox} ${num}. ${commit.subject}`);
      console.log(`      ${commit.hash.slice(0, 7)} • ${commit.author} • ${commit.date}`);
    });
    console.log(`${'─'.repeat(80)}\n`);

    const selectedCount = commits.filter(c => c.selected).length;
    console.log(`Selected: ${selectedCount} / ${commits.length} commits\n`);
  }

  function toggleCommit(index) {
    if (index >= 0 && index < commits.length) {
      commits[index].selected = !commits[index].selected;
    }
  }

  function parseSelection(input) {
    const parts = input.trim().toLowerCase().split(/\s+/);

    for (const part of parts) {
      if (part === 'all') {
        commits.forEach(c => (c.selected = true));
      } else if (part === 'none') {
        commits.forEach(c => (c.selected = false));
      } else if (part.includes('-')) {
        // Range like "1-5"
        const [start, end] = part.split('-').map(n => Number.parseInt(n, 10));
        if (!Number.isNaN(start) && !Number.isNaN(end)) {
          for (let i = start - 1; i < end && i < commits.length; i++) {
            if (i >= 0) toggleCommit(i);
          }
        }
      } else {
        // Single number
        const num = Number.parseInt(part, 10);
        if (!Number.isNaN(num)) {
          toggleCommit(num - 1);
        }
      }
    }
  }

  return new Promise(resolve => {
    displayCommits();

    rl.on('line', input => {
      const trimmed = input.trim().toLowerCase();

      if (trimmed === 'done' || trimmed === '') {
        rl.close();
        const selected = commits.filter(c => c.selected);
        resolve(selected);
      } else if (trimmed === 'quit' || trimmed === 'q') {
        console.log('\n❌ Cancelled\n');
        rl.close();
        process.exit(0);
      } else {
        parseSelection(input);
        displayCommits();
      }
    });

    rl.on('close', () => {
      const selected = commits.filter(c => c.selected);
      resolve(selected);
    });
  });
}

/**
 * Apply selected commits
 */
function applyCommits(commits) {
  if (commits.length === 0) {
    console.log('\n⚠️  No commits selected. Nothing to apply.\n');
    return;
  }

  console.log(`\n🚀 Applying ${commits.length} commit${commits.length === 1 ? '' : 's'}...\n`);

  for (const commit of commits) {
    console.log(`📦 Applying: ${commit.subject} (${commit.hash.slice(0, 7)})`);

    try {
      // Get original commit details
      const originalSubject = git(`log -1 --format=%s ${commit.hash}`, { silent: true });
      const originalBody = git(`log -1 --format=%b ${commit.hash}`, { silent: true });

      // Cherry-pick without committing
      git(`cherry-pick --no-commit ${commit.hash}`);

      // Create commit message
      let commitMsg = `${TEMPLATE_PREFIX} ${originalSubject}`;
      if (originalBody) {
        commitMsg += `\n\n${originalBody}`;
      }
      commitMsg += `\n\nSource: ${TEMPLATE_REPO_URL.replace('.git', '')}/commit/${commit.hash}`;

      // Commit with the new message
      git(`commit -m "${commitMsg.replace(/"/g, '\\"')}"`);

      console.log(`   ✓ Successfully applied\n`);
    } catch {
      console.error(`\n⚠️  Cherry-pick encountered conflicts for ${commit.hash}`);
      console.error('Resolve conflicts, then run:');
      console.error('  git add .');
      console.error('  git commit');
      console.error('Or abort with: git cherry-pick --abort\n');
      process.exit(1);
    }
  }

  console.log(`✅ Successfully applied ${commits.length} commit${commits.length === 1 ? '' : 's'}!\n`);
}

/**
 * Main function
 */
async function main() {
  // Check if remote is configured
  if (!checkRemoteConfigured()) {
    console.error(`\n❌ Template remote not configured. Run: pnpm template:setup\n`);
    process.exit(1);
  }

  // Find last applied commit
  const lastApplied = findLastAppliedCommit();

  if (lastApplied) {
    console.log(`\n🔍 Last applied template commit: ${lastApplied.slice(0, 7)}`);
  } else {
    console.log('\n🔍 No previous template commits found. Showing recent commits from template...');
  }

  // Get available commits
  const availableCommits = getAvailableCommits(lastApplied);

  // Let user select commits
  const selectedCommits = await selectCommits(availableCommits);

  // Apply selected commits
  applyCommits(selectedCommits);
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
