import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'menu-db.json');

// Initialize db
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ categories: [], items: [] }, null, 2));
}

export function readDb() {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

export function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
