const fs = require('fs');
const path = require('path');
const { Engine } = require('php-parser');

function findPhpFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file === 'node_modules' || file === '.git' || file === '.next') return;
      results = results.concat(findPhpFiles(filePath));
    } else {
      if (filePath.endsWith('.php')) results.push(filePath);
    }
  });
  return results;
}

const engine = new Engine({ parser: { extractDoc: true }, ast: { withPositions: true } });
const root = path.resolve(__dirname);
const phpFiles = findPhpFiles(root);
let errorCount = 0;
phpFiles.forEach(file => {
  try {
    const code = fs.readFileSync(file, 'utf8');
    engine.parseCode(code);
    console.log(`${file}: OK`);
  } catch (err) {
    errorCount++;
    console.error(`${file}: ERROR`);
    console.error(err && err.message ? err.message : String(err));
  }
});
if (errorCount > 0) process.exit(2);
process.exit(0);
