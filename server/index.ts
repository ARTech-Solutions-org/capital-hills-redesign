import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { db } from './db';
import { contentBlocks, projects, directMessages } from './db/schema';
import { eq, desc } from 'drizzle-orm';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// S3 Client for Cloudflare R2
const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME!;
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL!;

// --- API ROUTES ---

// 1. Upload images securely via backend to bypass R2 CORS
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  console.log('Hitting /api/upload', req.file ? 'File present' : 'No file');
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Sanitize filename and add timestamp to avoid collisions
    const safeFilename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: safeFilename,
      ContentType: file.mimetype,
      Body: file.buffer,
    });

    await S3.send(command);
    const publicUrl = `${PUBLIC_URL}/${safeFilename}`;

    res.json({ publicUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
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
    const { id, value } = req.body;
    await db.insert(contentBlocks).values({ id, value }).onConflictDoUpdate({
      target: contentBlocks.id,
      set: { value, updatedAt: new Date() },
    });
    res.json({ success: true });
  } catch (error) {
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

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
  });
}

export default app;
