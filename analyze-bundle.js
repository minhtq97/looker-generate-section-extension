#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing bundle size...\n');

// Run webpack bundle analyzer
try {
  execSync('ANALYZE_MODE=static yarn build', { stdio: 'inherit' });

  // Check if bundle.js exists and get its size
  const bundlePath = path.join(__dirname, 'dist', 'bundle.js');
  if (fs.existsSync(bundlePath)) {
    const stats = fs.statSync(bundlePath);
    const sizeInKB = (stats.size / 1024).toFixed(2);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`\n📦 Bundle size: ${sizeInKB} KB (${sizeInMB} MB)`);

    if (stats.size > 500 * 1024) {
      // 500KB
      console.log('⚠️  Bundle is larger than 500KB. Consider optimizations:');
      console.log('   - Use dynamic imports for large dependencies');
      console.log('   - Remove unused dependencies');
      console.log('   - Optimize icon imports');
      console.log('   - Enable code splitting');
    } else {
      console.log('✅ Bundle size is reasonable');
    }
  }
} catch (error) {
  console.error('❌ Failed to analyze bundle:', error.message);
  process.exit(1);
} 