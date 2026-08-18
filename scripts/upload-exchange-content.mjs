import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, resolve } from 'node:path';

const org = 'sayurihanki';
const repo = 'bcg-demo';
const branch = 'codex/bcg-exchange-port';
const previewRef = branch.replaceAll('/', '-');
const fixtureRoot = resolve('fixtures/bcg-exchange');
const sourceRoot = '/Users/hanki/Documents/Codex/2026-08-17/sites-plugin-sites-openai-bundled-create';
const mediaSource = `${sourceRoot}/public/og-products.png`;
const documents = [
  ['index.html', 'index.html', ''],
  ['products/marketplace-accelerator.html', 'products/marketplace-accelerator.html', 'products/marketplace-accelerator'],
  ['products/data-intelligence-ai.html', 'products/data-intelligence-ai.html', 'products/data-intelligence-ai'],
  ['products/deep-customer-engagement-ai.html', 'products/deep-customer-engagement-ai.html', 'products/deep-customer-engagement-ai'],
  ['products/supply-chain-ai.html', 'products/supply-chain-ai.html', 'products/supply-chain-ai'],
  ['products/frontline-ops-ai.html', 'products/frontline-ops-ai.html', 'products/frontline-ops-ai'],
  ['products/smart-banking-ai.html', 'products/smart-banking-ai.html', 'products/smart-banking-ai'],
  ['products/retail-ai.html', 'products/retail-ai.html', 'products/retail-ai'],
  ['products/revenue-growth-management-ai.html', 'products/revenue-growth-management-ai.html', 'products/revenue-growth-management-ai'],
];

async function getToken() {
  const raw = await readFile(`${homedir()}/.aem/da-token.json`, 'utf8');
  const cached = JSON.parse(raw);
  if (!cached.access_token || cached.expires_at <= Date.now() + 60_000) {
    throw new Error('DA token is missing or expired. Run the DA authentication flow.');
  }
  return cached.access_token;
}

async function requestWithRetry(url, options, attempt = 0) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    if (attempt >= 2) throw error;
    await new Promise((done) => { setTimeout(done, 2 ** attempt * 1000); });
    return requestWithRetry(url, options, attempt + 1);
  }
  if (response.ok) return response;
  const transient = [429, 500, 502, 503, 504].includes(response.status);
  if (!transient || attempt >= 2) {
    throw new Error(`${options.method} ${url} returned ${response.status}`);
  }
  await new Promise((done) => { setTimeout(done, 2 ** attempt * 1000); });
  return requestWithRetry(url, options, attempt + 1);
}

async function upload(absPath, daPath, mime, token) {
  const bytes = await readFile(absPath);
  const form = new FormData();
  form.append('data', new Blob([bytes], { type: mime }), basename(absPath));
  const url = `https://admin.da.live/source/${org}/${repo}/${daPath}`;
  const response = await requestWithRetry(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return response.status;
}

async function preview(path, token) {
  const suffix = path ? `/${path}` : '/';
  const url = `https://admin.hlx.page/preview/${org}/${repo}/${previewRef}${suffix}`;
  const response = await requestWithRetry(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.status;
}

const token = await getToken();
const mediaStatus = await upload(
  mediaSource,
  'media/bcg-exchange/og-products.png',
  'image/png',
  token,
);
// eslint-disable-next-line no-console
console.log(`Uploaded media/bcg-exchange/og-products.png (${mediaStatus})`);

await Promise.all(documents.map(async ([fixture, daPath, previewPath]) => {
  const uploadStatus = await upload(resolve(fixtureRoot, fixture), daPath, 'text/html', token);
  const previewStatus = await preview(previewPath, token);
  // eslint-disable-next-line no-console
  console.log(`Uploaded ${daPath} (${uploadStatus}); previewed ${previewPath || '/'} (${previewStatus})`);
}));
