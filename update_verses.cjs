const fs = require('fs');
const https = require('https');

const surahMap = {
  'آل عمران': 3,
  'النساء': 4,
  'الضحی': 93,
  'الشرح': 94,
  'التین': 95,
  'العلق': 96
};

function fetchSurah(surahNumber) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).data);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function persianToEnglish(str) {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  for (let i = 0; i < 10; i++) {
    str = str.replace(persianNumbers[i], englishNumbers[i]);
  }
  return str;
}

async function main() {
  console.log('Fetching surahs...');
  const surahsData = {};
  for (const [name, num] of Object.entries(surahMap)) {
    console.log(`Fetching Surah ${name} (${num})...`);
    surahsData[name] = await fetchSurah(num);
  }

  const lessonsPath = './src/data/lessons.ts';
  let content = fs.readFileSync(lessonsPath, 'utf8');

  // Update Lesson interface
  if (!content.includes('verses?:')) {
    content = content.replace('content?: string;', 'content?: string;\n  verses?: Array<{text: string, audio: string, numberInSurah: number}>;');
  }

  // Parse lessons
  const lessonRegex = /\{\s*id:\s*(\d+)[^}]*title:\s*'([^']+)'[^}]*\}/g;
  let match;
  const updates = [];

  while ((match = lessonRegex.exec(content)) !== null) {
    const lessonStr = match[0];
    const id = match[1];
    const title = match[2];

    // Extract surah and range
    // e.g. تلاوت آیات (۱-۴) سورۀ آل عمران
    // e.g. تلاوت آیت (۱۵۴) سورۀ آل عمران
    // e.g. حفظ آیات (۱-۴) سورۀ الضحی
    const titleMatch = title.match(/(?:آیات|آیت)\s*\(([\d\-۰-۹]+)\)\s*سورۀ\s*(.+)/);
    
    if (titleMatch) {
      const rangeStr = persianToEnglish(titleMatch[1]);
      const surahName = titleMatch[2].trim();
      
      let start, end;
      if (rangeStr.includes('-')) {
        [start, end] = rangeStr.split('-').map(Number);
      } else {
        start = end = Number(rangeStr);
      }

      if (surahsData[surahName]) {
        const ayahs = surahsData[surahName].ayahs.filter(a => a.numberInSurah >= start && a.numberInSurah <= end);
        
        const versesData = ayahs.map(a => ({
          text: a.text,
          audio: a.audio,
          numberInSurah: a.numberInSurah
        }));

        // Insert verses into the lesson object
        // We need to carefully replace the lesson string
        const newLessonStr = lessonStr.replace(/\}$/, `  verses: ${JSON.stringify(versesData)}\n  }`);
        updates.push({ old: lessonStr, new: newLessonStr });
      }
    }
  }

  for (const update of updates) {
    content = content.replace(update.old, update.new);
  }

  fs.writeFileSync(lessonsPath, content, 'utf8');
  console.log('Updated lessons.ts successfully!');
}

main().catch(console.error);
