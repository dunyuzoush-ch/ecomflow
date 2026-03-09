/**
 * EcomFlow GitHub Commit & Push
 * 自动commit并push到GitHub
 */

const { execSync } = require('child_process');
const path = require('path');

const repoPath = path.join(__dirname, '..');

function gitAdd() {
  console.log('📦 Adding files...');
  execSync('git add .', { cwd: repoPath, stdio: 'inherit' });
}

function gitCommit(message) {
  console.log('💾 Committing...');
  const msg = message || `Update: ${new Date().toISOString()}`;
  execSync(`git commit -m "${msg}"`, { cwd: repoPath, stdio: 'inherit' });
}

function gitPush() {
  console.log('📤 Pushing to GitHub...');
  execSync('git push origin master', { cwd: repoPath, stdio: 'inherit' });
}

const args = process.argv.slice(2);

if (args[0] === 'push') {
  gitAdd();
  gitCommit(args.slice(1).join(' '));
  gitPush();
  console.log('✅ Done!');
} else if (args[0] === 'commit') {
  gitAdd();
  gitCommit(args.slice(1).join(' '));
  console.log('✅ Committed (not pushed)');
} else {
  console.log('Usage:');
  console.log('  node scripts/git.js commit "Your message"');
  console.log('  node scripts/git.js push "Your message"');
}
