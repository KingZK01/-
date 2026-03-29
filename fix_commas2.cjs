const fs = require('fs');
let content = fs.readFileSync('src/data/lessons.ts', 'utf8');

// Fix missing commas before verses on the same line
content = content.replace(/'\s+verses:/g, "', verses:");

fs.writeFileSync('src/data/lessons.ts', content, 'utf8');
console.log('Fixed inline commas');
