const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

// Get the current branch name
function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (error) {
    console.error('Error getting current branch:', error.message);
    return 'unknown-branch';
  }
}

// Sanitize branch name for use in URL by replacing special characters with hyphens
function sanitizeBranchName(branchName) {
  return branchName.replace(/[^a-zA-Z0-9]/g, '-');
}

// Get custom base href from command line arguments if provided
function getBaseHref() {
  const args = process.argv.slice(2);
  const baseHrefArg = args.find(arg => arg.startsWith('--base-href='));
  
  if (baseHrefArg) {
    return baseHrefArg.split('=')[1];
  }
  
  const branchName = getCurrentBranch();
  
  // If we're on main, use the standard /WordLinker/ base href
  if (branchName === 'main') {
    return '/WordLinker/';
  }
  
  // Otherwise, use a branch-specific path
  const safeBranchName = sanitizeBranchName(branchName);
  return `/WordLinker/branches/${safeBranchName}/`;
}

// Build the application with the appropriate base href
function buildApp() {
  const baseHref = getBaseHref();
  console.log(`Building for branch with base href: ${baseHref}`);
  
  try {
    execSync(`ng build --configuration=production --base-href="${baseHref}"`, { stdio: 'inherit' });
    console.log('\nBuild completed successfully!');
    console.log(`\nTo test this build locally, run:`);
    console.log(`npx http-server dist/word-linker-angular/browser -p 8080 -o`);
    console.log(`\nWhen deployed, this build will be available at:`);
    console.log(`https://anthonykazyaka.github.io${baseHref}`);
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

buildApp();