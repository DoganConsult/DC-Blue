import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomBytes(16).toString('hex') + ext;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.png', '.jpg', '.jpeg', '.gif', '.txt', '.csv', '.zip'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('File type not allowed'));
  },
});

export default function filesRouter(pool, portalAuth) {
  const router = Router();

  router.post('/files/upload', portalAuth, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      const { entity_type, entity_id } = req.body;
      if (!entity_type || !entity_id) return res.status(400).json({ error: 'entity_type and entity_id required' });

      const result = await pool.query(
        `INSERT INTO file_uploads (entity_type, entity_id, filename, original_name, mime_type, size_bytes, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [entity_type, entity_id, req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, req.body.uploaded_by || 'admin']
      );

      res.status(201).json({ ok: true, file: result.rows[0] });
    } catch (e) {
      console.error('File upload error:', e.message);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  router.get('/files/:entityType/:entityId', portalAuth, async (req, res) => {
    try {
      const rows = await pool.query(
        'SELECT * FROM file_uploads WHERE entity_type = $1 AND entity_id = $2 ORDER BY created_at DESC',
        [req.params.entityType, req.params.entityId]
      );
      res.json({ data: rows.rows });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch files' });
    }
  });

  router.get('/files/download/:fileId', portalAuth, async (req, res) => {
    try {
      const row = await pool.query('SELECT * FROM file_uploads WHERE id = $1', [req.params.fileId]);
      if (!row.rows.length) return res.status(404).json({ error: 'File not found' });
      const filePath = path.join(UPLOAD_DIR, row.rows[0].filename);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });
      res.download(filePath, row.rows[0].original_name);
    } catch (e) {
      res.status(500).json({ error: 'Failed to download file' });
    }
  });

  router.delete('/files/:fileId', portalAuth, async (req, res) => {
    try {
      const row = await pool.query('SELECT * FROM file_uploads WHERE id = $1', [req.params.fileId]);
      if (!row.rows.length) return res.status(404).json({ error: 'File not found' });
      const filePath = path.join(UPLOAD_DIR, row.rows[0].filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await pool.query('DELETE FROM file_uploads WHERE id = $1', [req.params.fileId]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete file' });
    }
  });

  return router;
}
