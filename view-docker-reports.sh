#!/bin/bash

# Script to view reports generated inside Kali Docker container

CONTAINER="peaceful_meninsky"
OUTPUT_DIR="./docker-reports"

echo "🔍 Searching for reports inside Docker container..."

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Find HTML reports in common locations
LOCATIONS=("/tmp" "/root" "/kali-reports" "/root/reports")

for location in "${LOCATIONS[@]}"; do
    echo "Checking $location..."
    reports=$(docker exec $CONTAINER find "$location" -maxdepth 2 -name "*.html" 2>/dev/null)

    if [ -n "$reports" ]; then
        echo "✓ Found reports in $location:"
        echo "$reports"

        # Copy each report
        while IFS= read -r report; do
            filename=$(basename "$report")
            docker cp "$CONTAINER:$report" "$OUTPUT_DIR/$filename"
            echo "  → Copied: $filename"
        done <<< "$reports"
    fi
done

# List copied reports
if [ -d "$OUTPUT_DIR" ] && [ "$(ls -A $OUTPUT_DIR 2>/dev/null)" ]; then
    echo ""
    echo "📄 Reports copied to: $OUTPUT_DIR"
    ls -lh "$OUTPUT_DIR"

    # Open most recent report
    latest=$(ls -t "$OUTPUT_DIR"/*.html 2>/dev/null | head -1)
    if [ -n "$latest" ]; then
        echo ""
        echo "🌐 Opening most recent report in browser..."
        open "$latest"
    fi
else
    echo ""
    echo "⚠️  No HTML reports found in Docker container."
    echo ""
    echo "To generate a report, you can:"
    echo "  1. Click 'GENERATE HTML REPORT' button in the web terminal"
    echo "  2. Run commands inside Docker that create reports"
    echo "  3. Use: docker exec $CONTAINER [command to generate report]"
fi
