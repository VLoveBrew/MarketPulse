import { cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = resolve(rootDir, 'dist');

await mkdir(resolve(distDir, 'server'), { recursive: true });
await mkdir(resolve(distDir, '.openai'), { recursive: true });
await cp(resolve(rootDir, '.openai', 'hosting.json'), resolve(distDir, '.openai', 'hosting.json'));
await cp(resolve(rootDir, 'server', 'market-agent.mjs'), resolve(distDir, 'server', 'market-agent.mjs'));

await writeFile(
  resolve(distDir, 'server', 'index.js'),
  `import { handleMarketSnapshotRequest } from './market-agent.mjs';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/market-snapshot') {
      return handleMarketSnapshotRequest(request);
    }

    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ ok: true, service: 'marketpulse-agent' }), {
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || url.pathname.includes('.')) {
      return response;
    }

    const fallbackUrl = new URL('/index.html', request.url);
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  },
};
`,
);
