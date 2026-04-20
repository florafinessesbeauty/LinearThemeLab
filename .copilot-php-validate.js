const fs = require('fs');
const { Engine } = require('php-parser');

const filePath = 'C:\\Projects\\LinearThemeLab\\samples\\woocommerce-wholesale-electronics\\functions.php';
const code = fs.readFileSync(filePath, 'utf8');

const engine = new Engine({ parser: { extractDoc: true }, ast: { withPositions: true } });
try {
  engine.parseCode(code);
  console.log('PHP syntax: OK');
  process.exit(0);
} catch (err) {
  console.error('PHP syntax: ERROR');
  console.error(err && err.message ? err.message : String(err));
  process.exit(2);
}
