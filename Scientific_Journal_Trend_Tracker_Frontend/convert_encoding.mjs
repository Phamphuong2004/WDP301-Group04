import fs from 'fs';
import path from 'path';

function convertToUtf8(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      convertToUtf8(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      try {
        const buffer = fs.readFileSync(fullPath);
        // check if utf-16 le
        if (buffer[0] === 0xff && buffer[1] === 0xfe) {
          console.log('Converting', fullPath);
          const text = buffer.toString('utf16le');
          fs.writeFileSync(fullPath, text, 'utf8');
        } else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
          console.log('Converting', fullPath);
          const text = buffer.toString('utf16be');
          fs.writeFileSync(fullPath, text, 'utf8');
        }
      } catch (e) {
        console.error('Error on', fullPath, e);
      }
    }
  }
}

convertToUtf8('e:/WDP301_Group04/WDP301-Group04/Scientific_Journal_Trend_Tracker_Frontend/src');
