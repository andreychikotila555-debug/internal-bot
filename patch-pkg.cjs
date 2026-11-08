const fs = require('fs');
const p = JSON.parse(fs.readFileSync('package.json', 'utf8'));
p.bin = 'bot.js';
p.pkg = { targets: ['node18-win-x64'], assets: ['keys.json'], outputPath: '.' };
fs.writeFileSync('package.json', JSON.stringify(p, null, 2));
console.log('patched');
