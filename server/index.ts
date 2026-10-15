import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { db } from './db/index.js';
import { contentBlocks, projects, directMessages, visitBookings } from './db/schema.js';
import { eq, desc } from 'drizzle-orm';

import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory first, then fallback
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// 301 Permanent Redirects for Old Website URLs (SEO Link Equity)
const oldUrlRedirects: Record<string, string> = {
  '/about': '/about-us',
  '/about.html': '/about-us',
  '/contact.html': '/contact',
  '/projects.html': '/projects',
  '/careers.html': '/contact',
  '/careers': '/contact',
  '/index.php': '/',
};

app.use((req, res, next) => {
  const target = oldUrlRedirects[req.path.toLowerCase()];
  if (target) {
    return res.redirect(301, target);
  }
  next();
});

// Ensure root and uploads directory exist
const rootDir = fs.existsSync(path.resolve(__dirname, 'package.json'))
  ? __dirname
  : path.resolve(__dirname, '..');

const uploadsDir = path.resolve(rootDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Copy any bundled seed images from dist/uploads into uploadsDir
const distPath = path.resolve(rootDir, 'dist');
const bundledUploads = path.resolve(distPath, 'uploads');
try {
  if (fs.existsSync(bundledUploads)) {
    const files = fs.readdirSync(bundledUploads);
    for (const f of files) {
      const srcFile = path.join(bundledUploads, f);
      const destFile = path.join(uploadsDir, f);
      if (!fs.existsSync(destFile)) {
        fs.copyFileSync(srcFile, destFile);
      }
    }
  }
} catch (e) {
  console.warn('Could not sync bundled uploads:', e);
}

// Multer disk storage for local image uploads on GoDaddy
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '') || 'image';
    const safeFilename = `${Date.now()}-${basename}${ext}`;
    cb(null, safeFilename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max file size
});

// Serve uploaded images directly with cache headers
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '7d',
  immutable: true,
}));
app.use('/uploads', express.static(bundledUploads, {
  maxAge: '7d',
  immutable: true,
}));

// --- API ROUTES ---

// Prevent all CDN / Browser caching for API endpoints
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// 1. Upload images locally to GoDaddy server
app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer Upload Error:', err);
      return res.status(400).json({ error: err.message || 'Failed to upload file' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({ publicUrl });
  });
});

// 2. Content Blocks (Generic text)
app.get('/api/content', async (req, res) => {
  try {
    const blocks = await db.select().from(contentBlocks);
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const { id, value, valueAr } = req.body;
    const updateSet: Record<string, any> = { updatedAt: new Date() };
    if (value !== undefined) updateSet.value = value;
    if (valueAr !== undefined) updateSet.valueAr = valueAr;

    await db.insert(contentBlocks).values({
      id,
      value: value !== undefined ? value : '',
      valueAr: valueAr !== undefined ? valueAr : null,
    }).onConflictDoUpdate({
      target: contentBlocks.id,
      set: updateSet,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Save content error:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// 3. Projects
app.get('/api/projects', async (req, res) => {
  try {
    const allProjects = await db.select().from(projects).orderBy(projects.createdAt);
    res.json(allProjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...projectData } = req.body;
    const newProject = await db.insert(projects).values(projectData).returning();
    res.json(newProject[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...updateData } = req.body;
    const updated = await db.update(projects)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(projects.id, parseInt(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await db.delete(projects).where(eq(projects.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const allMessages = await db.select().from(directMessages).orderBy(desc(directMessages.createdAt));
    res.json(allMessages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    await db.insert(directMessages).values({ name, phone, email, message });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.patch('/api/messages/read', async (req, res) => {
  try {
    await db.update(directMessages).set({ isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(directMessages).where(eq(directMessages.id, id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// --- VISIT BOOKINGS ROUTES ---
app.get('/api/visits', async (req, res) => {
  try {
    const allVisits = await db.select().from(visitBookings).orderBy(desc(visitBookings.createdAt));
    res.json(allVisits);
  } catch (error) {
    console.error('Failed to fetch visits:', error);
    res.status(500).json({ error: 'Failed to fetch visit bookings' });
  }
});

app.post('/api/visits', async (req, res) => {
  try {
    const { projectName, name, phone, date, visitDate } = req.body;
    const finalDate = (date || visitDate || '').trim();
    if (!name || !phone || !finalDate) {
      return res.status(400).json({ error: 'Name, phone, and visit date are required' });
    }
    const [inserted] = await db.insert(visitBookings).values({
      projectName: (projectName || 'General Visit').trim(),
      name: name.trim(),
      phone: phone.trim(),
      visitDate: finalDate,
      status: 'pending',
      isRead: false,
    }).returning();
    res.json({ success: true, visit: inserted });
  } catch (error) {
    console.error('Failed to save visit booking:', error);
    res.status(500).json({ error: 'Failed to save visit booking' });
  }
});

app.patch('/api/visits/read-all', async (req, res) => {
  try {
    await db.update(visitBookings).set({ isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all visits as read' });
  }
});

app.patch('/api/visits/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, isRead, notes } = req.body;
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;
    if (notes !== undefined) updateData.notes = notes;
    await db.update(visitBookings).set(updateData).where(eq(visitBookings.id, id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update visit' });
  }
});

app.delete('/api/visits/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(visitBookings).where(eq(visitBookings.id, id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete visit' });
  }
});

// Serve static frontend files from dist (Vite build) relative to this file
app.use(express.static(distPath, { 
  redirect: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// API 404 handler (only for unhandled /api requests)
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'Not Found in API',
    url: req.url,
    originalUrl: req.originalUrl,
    path: req.path,
    method: req.method
  });
});

// SPA fallback for all other routes
app.use((req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('Application running, but frontend build (dist/index.html) was not found. Please run "npm run build".');
    }
  });
});

// In Phusion Passenger / cPanel, process.env.PORT can be a socket path string
// Phusion Passenger also sets PASSENGER_APP_ENV or exposes global PhusionPassenger
const isPassenger = typeof (globalThis as any).PhusionPassenger !== 'undefined' || !!process.env.PASSENGER_APP_ENV;
const portEnv = process.env.PORT;

if (typeof (globalThis as any).PhusionPassenger !== 'undefined') {
  (app as any).listen('passenger', () => {
    console.log('Server running with Phusion Passenger (hook)');
  });
} else if (portEnv && (portEnv.startsWith('/') || portEnv.includes('passenger') || portEnv.includes('.sock'))) {
  app.listen(portEnv, () => {
    console.log(`Server running on Passenger socket: ${portEnv}`);
  });
} else if (isPassenger) {
  (app as any).listen('passenger', () => {
    console.log('Server running on Passenger environment');
  });
} else {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
