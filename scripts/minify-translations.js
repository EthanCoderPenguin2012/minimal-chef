/**
 * Script to minify translation files for production
 *
 * This script:
 * 1. Reads all translation files from public/locales
 * 2. Minifies them by removing whitespace
 * 3. Saves them as .min.json files in the same directory
 *
 * Usage: node scripts/minify-translations.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const FILE_PATTERN = '**/*.json';
const EXCLUDE_PATTERN = '**/*.min.json';

// Function to minify JSON
function minifyJson(json) {
  return JSON.stringify(JSON.parse(json));
}

// Function to process a single file
function processFile(filePath) {
  try {
    // Skip already minified files
    if (filePath.endsWith('.min.json')) {
      return;
    }

    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');

    // Minify the content
    const minified = minifyJson(content);

    // Create the output path
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath, '.json');
    const outputPath = path.join(dir, `${basename}.min.json`);

    // Write the minified content
    fs.writeFileSync(outputPath, minified, 'utf8');

    // Calculate size reduction
    const originalSize = content.length;
    const minifiedSize = minified.length;
    const reduction = (
      ((originalSize - minifiedSize) / originalSize) *
      100
    ).toFixed(2);

    console.log(
      `✅ Minified ${filePath} -> ${outputPath} (${reduction}% reduction)`
    );
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Main function
function main() {
  console.log('🔍 Finding translation files...');

  // Find all JSON files in the locales directory
  const files = glob.sync(FILE_PATTERN, {
    cwd: LOCALES_DIR,
    ignore: EXCLUDE_PATTERN,
    absolute: false,
  });

  console.log(`📝 Found ${files.length} translation files to process`);

  // Process each file
  let successCount = 0;
  let errorCount = 0;

  files.forEach((file) => {
    const filePath = path.join(LOCALES_DIR, file);
    try {
      processFile(filePath);
      successCount++;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      errorCount++;
    }
  });

  console.log('\n📊 Summary:');
  console.log(`✅ Successfully minified: ${successCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log('✨ Done!');
}

// Run the script
main();
