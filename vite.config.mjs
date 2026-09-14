import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleMarketSnapshotRequest } from './server/market-agent.mjs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'marketpulse-agent-dev-api',
      configureServer(server) {
        server.middlewares.use('/api/market-snapshot', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: 'Use POST with topic, geography, and audience.' }));
            return;
          }

          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', async () => {
            const body = Buffer.concat(chunks).toString('utf8') || '{}';
            const request = new Request('http://localhost/api/market-snapshot', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body,
            });
            const response = await handleMarketSnapshotRequest(request);
            res.statusCode = response.status;
            response.headers.forEach((value, key) => res.setHeader(key, value));
            res.end(await response.text());
          });
        });

        server.middlewares.use('/api/health', (_req, res) => {
          res.statusCode = 200;
          res.setHeader('content-type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ ok: true, service: 'marketpulse-agent' }));
        });
      },
    },
  ],
});
