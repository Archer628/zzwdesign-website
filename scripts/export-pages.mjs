import { cp, mkdir, readFile, writeFile, readdir, stat, mkdtemp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = '/zzwdesign-website';
const snapshot = path.join(root, 'pages-data');
if (process.argv.includes('--snapshot')) {
  const db = new PrismaClient({ datasourceUrl: `file:${path.join(root, 'data/app.db').replaceAll('\\', '/')}` });
  try {
    const works = await db.work.findMany({ where: { published: true }, orderBy: [{ order: 'asc' }, { id: 'asc' }],
      select: { id: true, sourceKey: true, title: true, slug: true, cover: true, images: true, imageCaptions: true, summary: true, description: true, tags: true, year: true, link: true, order: true, published: true } });
    const keys = ['title', 'subtitle', 'worksLabel', 'aboutLabel', 'aboutContent', 'aboutPortrait'];
    const settings = Object.fromEntries((await db.setting.findMany({ where: { key: { in: keys } } })).map(s => [s.key, s.value]));
    const json = JSON.stringify({ works, settings }, null, 2);
    const files = new Set([...json.matchAll(/\/uploads\/([A-Za-z0-9_.-]+)/g)].map(m => m[1]));
    for (const name of [...files]) if (name.endsWith('-1600.webp')) files.add(name.replace('-1600.webp', '-800.webp'));
    await mkdir(path.join(snapshot, 'uploads'), { recursive: true });
    for (const name of files) await cp(path.join(root, 'public/uploads', name), path.join(snapshot, 'uploads', name));
    await writeFile(path.join(snapshot, 'content.json'), json);
    console.log(`Public snapshot: ${works.length} published works, ${files.size} media files.`);
  } finally { await db.$disconnect(); }
}
const data = JSON.parse(await readFile(path.join(snapshot, 'content.json'), 'utf8'));
assert(data.works.length > 0, 'No published works');
assert(data.works.every(w => w.published), 'Snapshot must contain published works only');
const cache = path.join(root, 'dist');
await mkdir(cache, { recursive: true });
const build = await mkdtemp(path.join(cache, 'zzwdesign-pages-'));
async function copy(name) { await cp(path.join(root, name), path.join(build, name), { recursive: true }); }
for (const name of ['src/app/(public)', 'src/app/layout.tsx', 'src/app/globals.css', 'src/app/error.tsx', 'src/app/not-found.tsx', 'src/app/icon.png', 'src/components/home.tsx', 'src/components/site.tsx', 'src/components/description.tsx', 'src/components/media-image.tsx', 'src/lib/content.ts', 'src/lib/about.ts', 'public/fonts', 'public/icons', 'tsconfig.json', 'next-env.d.ts', 'postcss.config.mjs']) await copy(name);
await cp(path.join(snapshot, 'uploads'), path.join(build, 'public/uploads'), { recursive: true });
await writeFile(path.join(build, 'src/lib/pages-content.json'), JSON.stringify(data).replaceAll('/uploads/', `${base}/uploads/`));
await writeFile(path.join(build, 'src/lib/data.ts'), `import data from './pages-content.json';\nimport { defaults, type WorkView } from './content';\nexport async function works(): Promise<WorkView[]> { return data.works; }\nexport async function settings() { return {...defaults, ...data.settings}; }\n`);
async function transform(file, change) { const p = path.join(build, file); await writeFile(p, change(await readFile(p, 'utf8'))); }
await transform('src/app/(public)/about/page.tsx', s => s.replace("import { db } from '@/lib/db';", "import { settings } from '@/lib/data';").replace(/const values=Object\.fromEntries\([^\n]+;/, 'const values=await settings();'));
await transform('src/app/(public)/works/[slug]/page.tsx', s => s + '\nexport const dynamicParams=false;\nexport async function generateStaticParams(){return (await works()).map(w=>({slug:w.slug}));}\n');
async function walk(dir) {
  const files = [];
  for (const item of await readdir(dir, { withFileTypes: true })) { const p = path.join(dir, item.name); files.push(...(item.isDirectory() ? await walk(p) : [p])); }
  return files;
}
for (const file of await walk(path.join(build, 'src'))) if (/\.(tsx?|css)$/.test(file)) {
  const s = await readFile(file, 'utf8');
  await writeFile(file, s.replaceAll("export const dynamic='force-dynamic';", "export const dynamic='force-static';").replaceAll('/fonts/', `${base}/fonts/`).replaceAll('/icons/', `${base}/icons/`).replace("new URL('https://zzwdesign.cn')", "new URL('https://archer628.github.io/zzwdesign-website/')"));
}
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
await writeFile(path.join(build, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies: pkg.dependencies, devDependencies: pkg.devDependencies }));
await writeFile(path.join(build, 'next.config.mjs'), `export default {output:'export',basePath:'${base}',trailingSlash:true,poweredByHeader:false,images:{unoptimized:true}};\n`);
execFileSync(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build'], { cwd: build, stdio: 'inherit' });
const output = path.join(build, 'out');
await writeFile(path.join(output, '.nojekyll'), '');
for (const work of data.works) assert((await stat(path.join(output, 'works', work.slug, 'index.html'))).isFile());
assert(!(await readdir(output)).includes('admin'), 'Admin must not be statically published');
await mkdir(path.join(root, 'dist'), { recursive: true });
await writeFile(path.join(root, 'dist/pages-export.json'), JSON.stringify({ output, base, works: data.works.map(w => w.slug), generatedAt: new Date().toISOString() }, null, 2));
console.log(`PAGES_OUTPUT=${output}`);
