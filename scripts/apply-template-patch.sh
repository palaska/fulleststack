#!/bin/bash

# Script to apply a specific commit from the fulleststack template repository
# Usage: ./scripts/apply-template-patch.sh <commit-sha>

set -e

TEMPLATE_REPO_URL="github.com/palaska/fulleststack"
COMMIT_SHA="$1"

if [ -z "$COMMIT_SHA" ]; then
    echo "Error: Commit SHA is required"
    echo "Usage: $0 <commit-sha>"
    exit 1
fi

PATCH_URL="https://${TEMPLATE_REPO_URL}/commit/${COMMIT_SHA}.patch"
TEMP_PATCH_FILE="/tmp/fulleststack-${COMMIT_SHA}.patch"

echo "Downloading patch from ${PATCH_URL}..."
if command -v curl &> /dev/null; then
    curl -fsSL "$PATCH_URL" -o "$TEMP_PATCH_FILE"
elif command -v wget &> /dev/null; then
    wget -q "$PATCH_URL" -O "$TEMP_PATCH_FILE"
else
    echo "Error: Neither curl nor wget is available"
    exit 1
fi

if [ ! -s "$TEMP_PATCH_FILE" ]; then
    echo "Error: Failed to download patch or patch file is empty"
    rm -f "$TEMP_PATCH_FILE"
    exit 1
fi

echo "Applying patch..."
if git apply --check "$TEMP_PATCH_FILE" 2>/dev/null; then
    git apply "$TEMP_PATCH_FILE"
    echo "✓ Patch applied successfully"
elif git apply --3way "$TEMP_PATCH_FILE" 2>/dev/null; then
    echo "✓ Patch applied with 3-way merge"
else
    echo "Error: Failed to apply patch cleanly"
    echo "You may need to resolve conflicts manually"
    echo "Patch file saved at: $TEMP_PATCH_FILE"
    exit 1
fi

echo "Cleaning up..."
rm -f "$TEMP_PATCH_FILE"
echo "✓ Done"

