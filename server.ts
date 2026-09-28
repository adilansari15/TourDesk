import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './server/config/db.js';
import app from './server/app.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  // Connect to MongoDB Atlas if URI is provided
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
    } catch (err: any) {
      console.warn('⚠️  MongoDB Atlas Connection Warning:', err?.message || err);
      console.warn('👉  Ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.');
    }
  } else {
    console.warn('⚠️  MONGODB_URI is not set in environment variables.');
  }

  // In development, integrate Vite middlewares
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Transform and serve index.html for all non-API client routes
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // In production, serve built frontend assets from dist/
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MERN Auth Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
