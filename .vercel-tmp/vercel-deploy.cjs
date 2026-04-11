#!/usr/bin/env node
/**
 * Vercel CLI Deployment Script (Cross-Platform)
 * Usage: node deploy.cjs [project-path] [options]
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';

const VERCEL_BIN = path.join(process.cwd(), 'node_modules', 'vercel', 'dist', 'vc.js');

function log(msg) {
  console.error(msg);
}

function parseArgs(args) {
  const result = {
    projectPath: '.',
    prod: true,
    yes: false,
    skipBuild: false
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--prod') result.prod = true;
    else if (arg === '--yes' || arg === '-y') result.yes = true;
    else if (arg === '--skip-build') result.skipBuild = true;
    else if (!arg.startsWith('-')) result.projectPath = arg;
  }
  return result;
}

function checkVercelInstalled() {
  if (!fs.existsSync(VERCEL_BIN)) {
    log('Error: Vercel CLI is not installed');
    process.exit(1);
  }
  const result = spawnSync('node', [VERCEL_BIN, '--version'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  const version = (result.stdout || '').trim();
  log(`Vercel CLI version: ${version}`);
}

function checkLoginStatus() {
  log('Checking login status...');
  try {
    const result = spawnSync('node', [VERCEL_BIN, 'whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const output = (result.stdout || '').trim();
    if (result.status === 0 && output && !output.includes('Error')) {
      log(`Logged in as: ${output}`);
      return true;
    }
  } catch {}
  return false;
}

function checkProject(projectPath) {
  const absPath = path.resolve(projectPath);
  if (!fs.existsSync(absPath) || !fs.statSync(absPath).isDirectory()) {
    log(`Error: Project directory does not exist: ${absPath}`);
    process.exit(1);
  }
  log(`Project path: ${absPath}`);
  return absPath;
}

function detectPackageManager(projectPath) {
  if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function runBuildIfNeeded(projectPath) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) return true;

  let packageJson;
  try { packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')); } catch { return true; }
  if (!packageJson.scripts || !packageJson.scripts.build) return true;

  log('');
  log('========================================');
  log('Running pre-deployment build...');
  log('========================================');

  const pkgManager = detectPackageManager(projectPath);
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log('Installing dependencies...');
    spawnSync(pkgManager, ['install'], { cwd: projectPath, stdio: 'inherit', shell: isWindows });
  }

  const buildArgs = pkgManager === 'npm' ? ['run', 'build'] : ['build'];
  log(`Executing: ${pkgManager} ${buildArgs.join(' ')}`);
  const result = spawnSync(pkgManager, buildArgs, { cwd: projectPath, stdio: 'inherit', shell: isWindows });
  if (result.status !== 0) {
    log('Build FAILED!');
    process.exit(1);
  }
  log('Build completed successfully!');
  return true;
}

function doDeploy(projectPath, options) {
  log('');
  log('Starting deployment...');

  const args = [];
  if (options.yes) args.push('--yes');
  if (options.prod) args.push('--prod');

  log(`Environment: ${options.prod ? 'Production' : 'Preview'}`);
  log(`Executing: node vc.js ${args.join(' ')}`);
  log('========================================');

  const result = spawnSync('node', [VERCEL_BIN, ...args], {
    cwd: projectPath,
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
    timeout: 300000
  });

  const output = (result.stdout || '') + (result.stderr || '');
  log(output);

  if (result.status !== 0) {
    log('Deployment failed');
    process.exit(1);
  }

  const aliasedMatch = output.match(/Aliased:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
  const deploymentMatch = output.match(/Production:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
  const finalUrl = aliasedMatch ? aliasedMatch[1] : (deploymentMatch ? deploymentMatch[1] : null);

  log('');
  log('========================================');
  log('Deployment successful!');
  log('========================================');

  if (finalUrl) {
    log(`Your site is live! Visit: ${finalUrl}`);
    console.log(JSON.stringify({ status: 'success', url: finalUrl }));
  } else {
    console.log(JSON.stringify({ status: 'success', message: 'Deployment successful' }));
  }
}

function main() {
  log('========================================');
  log('Vercel CLI Project Deployment');
  log('========================================');
  log('');

  const args = process.argv.slice(2);
  const options = parseArgs(args);

  checkVercelInstalled();
  log('');
  if (!checkLoginStatus()) {
    log('Error: Not logged in');
    process.exit(1);
  }
  log('');

  const projectPath = checkProject(options.projectPath);
  if (!options.skipBuild) runBuildIfNeeded(projectPath);
  doDeploy(projectPath, options);
}

main();
