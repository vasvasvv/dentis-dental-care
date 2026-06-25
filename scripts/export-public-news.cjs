const { access, mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const outputFile = path.join(rootDir, 'src', 'data', 'publicNews.generated.ts');
const apiBase = (process.env.VITE_API_URL || 'https://dentis-site-api.nesterenkovasil9.workers.dev').replace(/\/+$/, '');
const languages = ['uk', 'en'];

async function fileExists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function fetchNews(lang) {
  const url = `${apiBase}/api/public/news?lang=${lang}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`GET ${url} returned non-array JSON`);
  }

  return data;
}

function renderSnapshot(newsByLang) {
  return `import type { PublicNewsItem } from "@/lib/publicApi";

export const publicNewsByLang: Record<"uk" | "en", PublicNewsItem[]> = ${JSON.stringify(newsByLang, null, 2)};
`;
}

async function main() {
  try {
    const entries = await Promise.all(languages.map(async (lang) => [lang, await fetchNews(lang)]));
    const newsByLang = Object.fromEntries(entries);

    await mkdir(path.dirname(outputFile), { recursive: true });
    await writeFile(outputFile, renderSnapshot(newsByLang), 'utf8');
    console.log(`[export-public-news] Wrote ${path.relative(rootDir, outputFile)}`);
  } catch (error) {
    if (await fileExists(outputFile)) {
      console.warn(`[export-public-news] ${error.message}`);
      console.warn('[export-public-news] Keeping existing snapshot');
      return;
    }

    console.error(`[export-public-news] ${error.message}`);
    console.error('[export-public-news] Snapshot is missing');
    process.exitCode = 1;
  }
}

main();
