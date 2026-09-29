#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeProduct, renderSnapshotModule, sitemapProducts } from './import-helpers.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const assetsDir = resolve(root, 'assets/products');
const outputFile = resolve(root, 'js/catalog-data.js');
const manifestFile = resolve(root, 'data/catalog-manifest.json');
const sitemapUrl = 'https://krasku.ru/sitemap.xml';
const requestedLimit = Number(process.argv.find(arg => arg.startsWith('--limit='))?.split('=')[1] || 0);
const concurrency = Math.max(1, Number(process.env.IMPORT_CONCURRENCY || 6));

async function fetchText(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'KRASKU-static-catalog-importer/1.0' } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function downloadImage(url, product) {
  const suffix = extname(new URL(url).pathname).toLowerCase().replace('.jpeg', '.jpg') || '.jpg';
  const target = resolve(assetsDir, `${product.slug}${suffix}`);
  const response = await fetch(url, { headers: { 'user-agent': 'KRASKU-static-catalog-importer/1.0' } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
  product.image = `assets/products/${basename(target)}`;
  product.images = [product.image];
}

async function mapConcurrent(items, worker) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index], index);
    }
  }));
  return results;
}

const sitemap = await fetchText(sitemapUrl);
const entries = sitemapProducts(sitemap);
const selected = requestedLimit > 0 ? entries.slice(0, requestedLimit) : entries;
await Promise.all([mkdir(assetsDir, { recursive: true }), mkdir(resolve(root, 'data'), { recursive: true })]);

const failures = [];
const loaded = await mapConcurrent(selected, async (entry, index) => {
  try {
    const html = await fetchText(entry.sourceUrl);
    const product = normalizeProduct(entry, html, index + 1);
    try {
      await downloadImage(entry.imageUrl, product);
    } catch (error) {
      failures.push({ sourceUrl: entry.sourceUrl, stage: 'image', message: error.message });
    }
    return product;
  } catch (error) {
    failures.push({ sourceUrl: entry.sourceUrl, stage: 'page', message: error.message });
    return null;
  }
});

const products = loaded.filter(Boolean);
const categoryMap = new Map();
for (const product of products) {
  const current = categoryMap.get(product.category) || { name: product.category, slug: product.category.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-').replace(/^-|-$/g, ''), desc: '', count: 0, image: product.image, children: [] };
  current.count += 1;
  if (current.children.length < 3 && !current.children.includes(product.brand)) current.children.push(product.brand);
  categoryMap.set(product.category, current);
}
const snapshot = {
  source: 'https://krasku.ru/',
  importedAt: new Date().toISOString(),
  catalogConfig: { surfaceCatalogueEnabled: true, seedSurfacesFromText: true },
  categories: [...categoryMap.values()],
  products
};
await writeFile(outputFile, renderSnapshotModule(snapshot));
await writeFile(manifestFile, JSON.stringify({ sitemapUrl, discovered: entries.length, imported: products.length, failures }, null, 2));
console.log(JSON.stringify({ discovered: entries.length, imported: products.length, failed: failures.length, outputFile, manifestFile }));
