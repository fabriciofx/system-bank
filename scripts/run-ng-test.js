#!/usr/bin/env node
const { execSync } = require('node:child_process');
const path = require('node:path');

// Pega todos os arquivos do lint-staged (podem ser absolutos)
const args = process.argv.slice(2).map((f) => path.relative(process.cwd(), f));

if (args.length === 0) {
  console.log('No files to test.');
  process.exit(0);
}

// Executa ng test apenas nos arquivos convertidos em relativos
try {
  args.map((file) =>
    execSync(`ng test --include ${file}`, { stdio: 'inherit' })
  );
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
