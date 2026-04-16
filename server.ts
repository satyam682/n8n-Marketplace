import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('marketplace.db');

// Initialize Database
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
    tags TEXT, -- Stored as comma-separated string
    workflowJson TEXT,
    stars INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    score REAL, -- Score out of 10
    downloadUrl TEXT, -- Download URL for the template
    createdAt INTEGER,
    updatedAt INTEGER,
    FOREIGN KEY(authorId) REFERENCES users(id)
  );

  -- Seed Data
  INSERT OR IGNORE INTO users (id, email, displayName, createdAt) 
  VALUES ('user1', 'expert@n8n.io', 'n8n Expert', 1712880000000);

  INSERT OR IGNORE INTO templates (id, title, description, authorId, authorName, category, tags, workflowJson, stars, downloads, createdAt, updatedAt)
  VALUES 
  ('t1', 'AI Content Generator', 'Generate SEO optimized blog posts using GPT-4 and WordPress.', 'user1', 'n8n Expert', 'AI', 'gpt4,wordpress,seo', '{}', 124, 850, 1712880000000, 1712880000000),
  ('t2', 'Slack Error Notifier', 'Get instant alerts in Slack whenever a workflow fails.', 'user1', 'n8n Expert', 'Utility', 'slack,error,monitoring', '{}', 89, 1200, 1712966400000, 1712966400000),
  ('t3', 'Shopify to Google Sheets', 'Sync new Shopify orders to Google Sheets for easy tracking.', 'user1', 'n8n Expert', 'E-commerce', 'shopify,google-sheets,sync', '{}', 56, 450, 1713052800000, 1713052800000);
`);

// Migration for existing users table (add new columns if they don't exist)
const userColumns = ['github', 'twitter', 'website', 'photoURL', 'bio'];
userColumns.forEach(column => {
  try {
    db.exec(`ALTER TABLE users ADD COLUMN ${column} TEXT;`);
  } catch (e) {
    // Column already exists, ignore error
  }
});

// Migration for existing templates table (add new columns if they don't exist)
const templateColumns = ['score', 'downloadUrl'];
templateColumns.forEach(column => {
  try {
    if (column === 'score') {
      db.exec(`ALTER TABLE templates ADD COLUMN ${column} REAL;`);
    } else {
      db.exec(`ALTER TABLE templates ADD COLUMN ${column} TEXT;`);
    }
  } catch (e) {
    // Column already exists, ignore error
  }
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/templates', (req, res) => {
    const { category, search, sort } = req.query;
    let query = 'SELECT * FROM templates WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (req.query.authorId) {
      query += ' AND authorId = ?';
      params.push(req.query.authorId);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (sort === 'popular') {
      query += ' ORDER BY stars DESC';
    } else if (sort === 'downloads') {
      query += ' ORDER BY downloads DESC';
    } else {
      query += ' ORDER BY createdAt DESC';
    }

    const templates = db.prepare(query).all(...params);
    res.json(templates.map((t: any) => ({
      ...t,
      tags: t.tags ? t.tags.split(',') : [],
      score: t.score || null,
      downloadUrl: t.downloadUrl || null
    })));
  });

  app.get('/api/templates/:id', (req, res) => {
    const template = db.prepare('SELECT * FROM templates WHERE id = ?').get(req.params.id) as any;
    if (template) {
      res.json({
        ...template,
        tags: template.tags ? template.tags.split(',') : [],
        score: template.score || null,
        downloadUrl: template.downloadUrl || null
      });
    } else {
      res.status(404).json({ error: 'Template not found' });
    }
  });

  app.post('/api/templates', (req, res) => {
    const { id, title, description, authorId, authorName, category, tags, workflowJson, score, downloadUrl } = req.body;
    const now = Date.now();
    try {
      db.prepare(`
        INSERT INTO templates (id, title, description, authorId, authorName, category, tags, workflowJson, stars, downloads, score, downloadUrl, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, title, description, authorId, authorName, category, tags.join(','), workflowJson, 0, 0, score || null, downloadUrl || null, now, now);
      res.status(201).json({ id, status: 'published' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to publish template' });
    }
  });

  app.post('/api/auth/register', (req, res) => {
    const { uid, email, displayName } = req.body;
    const now = Date.now();
    try {
      db.prepare(`
        INSERT INTO users (id, email, displayName, createdAt)
        VALUES (?, ?, ?, ?)
      `).run(uid, email, displayName, now);
      res.status(201).json({ uid, email, displayName });
    } catch (error) {
      res.status(500).json({ error: 'User registration failed' });
    }
  });

  app.get('/api/users/:id', (req, res) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  app.patch('/api/users/:id', (req, res) => {
    const { displayName, bio, photoURL, github, twitter, website } = req.body;
    try {
      db.prepare(`
        UPDATE users 
        SET displayName = COALESCE(?, displayName),
            bio = COALESCE(?, bio),
            photoURL = COALESCE(?, photoURL),
            github = COALESCE(?, github),
            twitter = COALESCE(?, twitter),
            website = COALESCE(?, website)
        WHERE id = ?
      `).run(displayName, bio, photoURL, github, twitter, website, req.params.id);
      
      const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
