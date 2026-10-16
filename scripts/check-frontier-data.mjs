import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import YAML from 'yaml';
const data=JSON.parse(await fs.readFile('src/data/research.json','utf8'));
const map=JSON.parse(await fs.readFile('src/data/maps.json','utf8'));
assert.equal(data.classes.length,17);assert.equal(data.classes.filter(c=>c.starting).length,6);
const ids=new Set(data.sources.map(s=>s.id));
for(const c of data.classes){assert(c.build.summary);for(const id of c.sourceIds)assert(ids.has(id),`Unknown source ${id}`);for(const category of ['classes','builds'])await fs.access(`src/content/wiki/en/${category}/${c.slug}.mdx`);}
for(const m of map.markers){assert(m.x>=0&&m.x<=100&&m.y>=0&&m.y<=100);assert(m.source.startsWith('https://'));}
const ui=JSON.parse(await fs.readFile('src/locales/en.json','utf8'));let articles=0;
for(const category of await fs.readdir('src/content/wiki/en')){for(const file of await fs.readdir(`src/content/wiki/en/${category}`)){if(!file.endsWith('.mdx'))continue;let text=await fs.readFile(`src/content/wiki/en/${category}/${file}`,'utf8');let fm=YAML.parse(text.split('---')[1]);if(fm.draft)continue;assert(ui.nav[category]);assert.equal(fm.category,category);assert(text.includes('## Sources and version notes'),`${file}: source section absent`);assert(!/Anvil Quest|ANVIL-DAWN|TODO|TBD/.test(text));articles++;}}
console.log(`Verified ${articles} sourced articles, 17 class/build pairs, and ${map.markers.length} map markers.`);
await import('./check-article-covers.mjs');
