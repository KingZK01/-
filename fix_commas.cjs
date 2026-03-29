const fs = require('fs');
let content = fs.readFileSync('src/data/lessons.ts', 'utf8');

// Fix literal \n
content = content.replace(/,\\n\s*verses:/g, ',\n    verses:');

// Fix any missing commas that still exist
content = content.replace(/([^,])\s*\n\s*verses:/g, '$1,\n    verses:');

fs.writeFileSync('src/data/lessons.ts', content, 'utf8');
console.log('Fixed commas and newlines');
