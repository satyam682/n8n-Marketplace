import fs from 'fs';
import Papa from 'papaparse';
import Database from 'better-sqlite3';

interface CSVTemplate {
  id?: string;
  title: string;
  description: string;
  category: string;
  downloadUrl: string;
  score: string; // Will be converted to number
  authorId?: string;
  authorName?: string;
  tags?: string; // Comma-separated tags
}

const db = new Database('marketplace.db');
db.pragma('foreign_keys = ON');

function ensureDatabaseSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      displayName TEXT,
      photoURL TEXT,
      bio TEXT,
      github TEXT,
      twitter TEXT,
      website TEXT,
      createdAt INTEGER
    );

    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      authorId TEXT,
      authorName TEXT,
      authorPhoto TEXT,
      category TEXT,
      tags TEXT,
      workflowJson TEXT,
      stars INTEGER DEFAULT 0,
      downloads INTEGER DEFAULT 0,
      score REAL,
      downloadUrl TEXT,
      createdAt INTEGER,
      updatedAt INTEGER,
      FOREIGN KEY(authorId) REFERENCES users(id)
    );
  `);

  const existingTemplateColumns = db
    .prepare("PRAGMA table_info(templates);")
    .all()
    .map((column: any) => column.name);

  const templateColumnsToAdd = [
    { name: 'authorPhoto', type: 'TEXT' },
    { name: 'score', type: 'REAL' },
    { name: 'downloadUrl', type: 'TEXT' }
  ];

  templateColumnsToAdd.forEach(({ name, type }) => {
    if (!existingTemplateColumns.includes(name)) {
      db.exec(`ALTER TABLE templates ADD COLUMN ${name} ${type};`);
    }
  });
}

function importTemplatesFromCSV(csvFilePath: string) {
  console.log('Starting CSV import...');

  ensureDatabaseSchema();

  // Read the CSV file
  const csvData = fs.readFileSync(csvFilePath, 'utf8');

  // Parse CSV
  const parsed = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => {
      // Normalize header names
      return header.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    }
  });

  if (parsed.errors.length > 0) {
    console.error('CSV parsing errors:', parsed.errors);
    return;
  }

  console.log(`Found ${parsed.data.length} templates in CSV`);

  // Prepare insert statement
  const insertTemplate = db.prepare(`
    INSERT OR REPLACE INTO templates (
      id, title, description, authorId, authorName, category, tags,
      workflowJson, stars, downloads, score, downloadUrl, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Default author for imported templates
  const defaultAuthorId = 'n8n-expert';
  const defaultAuthorName = 'n8n Expert';
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, displayName, createdAt)
    VALUES (?, ?, ?, ?)
  `);

  // Insert each template
  let successCount = 0;
  let errorCount = 0;

  parsed.data.forEach((row: any, index: number) => {
    try {
      const template: CSVTemplate = row as CSVTemplate;

      // Generate ID if not provided
      const id = template.id || `template_${index + 1}`;
      const authorId = template.authorId?.trim() || defaultAuthorId;
      const authorName = template.authorName?.trim() || defaultAuthorName;

      // Ensure author record exists for the foreign key
      insertUser.run(authorId, null, authorName, Date.now());

      // Convert score to number
      const score = parseFloat(template.score) || 0;

      // Parse tags (assuming comma-separated)
      const tags = template.tags ? template.tags.split(',').map(tag => tag.trim()) : [];

      // Generate random stars and downloads based on score
      const baseStars = Math.floor(score * 10) + Math.floor(Math.random() * 50);
      const baseDownloads = Math.floor(score * 100) + Math.floor(Math.random() * 500);

      const now = Date.now();

      insertTemplate.run(
        id,
        template.title,
        template.description,
        authorId,
        authorName,
        template.category,
        tags.join(','),
        '{}', // Empty workflow JSON for imported templates
        baseStars,
        baseDownloads,
        score,
        template.downloadUrl,
        now - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
        now
      );

      successCount++;
    } catch (error) {
      console.error(`Error importing template at row ${index + 1}:`, error);
      errorCount++;
    }
  });

  console.log(`Import completed: ${successCount} successful, ${errorCount} errors`);

  // Update the seed data to avoid conflicts
  try {
    db.exec(`DELETE FROM templates WHERE id IN ('t1', 't2', 't3')`);
    console.log('Removed old seed data');
  } catch (e) {
    console.log('No old seed data to remove');
  }
}

// Check if CSV file path is provided
const csvFilePath = process.argv[2];
if (!csvFilePath) {
  console.error('Usage: tsx import-templates.ts <path-to-csv-file>');
  console.error('Example: tsx import-templates.ts n8n-templates.csv');
  process.exit(1);
}

// Check if file exists
if (!fs.existsSync(csvFilePath)) {
  console.error(`CSV file not found: ${csvFilePath}`);
  process.exit(1);
}

importTemplatesFromCSV(csvFilePath);
db.close();