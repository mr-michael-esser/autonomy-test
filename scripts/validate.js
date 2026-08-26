const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const requiredFiles = ['index.html', 'styles.css'];

for (const file of requiredFiles) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${file}`);
  if (fs.statSync(filePath).size === 0) throw new Error(`Required file is empty: ${file}`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

const requiredHtml = [
  '<!doctype html>',
  '<html lang="en">',
  '<meta name="viewport"',
  '<title>',
  '<link rel="stylesheet" href="styles.css">',
  '<main',
];
for (const marker of requiredHtml) {
  if (!html.toLowerCase().includes(marker.toLowerCase())) {
    throw new Error(`index.html is missing: ${marker}`);
  }
}

const stylesheet = html.match(/<link[^>]+href="([^"]+)"/i)?.[1];
if (stylesheet !== 'styles.css') throw new Error(`Unexpected stylesheet reference: ${stylesheet}`);
if (!css.includes(':root')) throw new Error('styles.css has no root variables');
if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) {
  throw new Error('styles.css has unbalanced braces');
}

console.log('Validation passed: required landing-page files and markup are present.');
