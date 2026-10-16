import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import YAML from 'yaml';
const root='src/content/wiki/en';
const registry=JSON.parse(await fs.readFile('src/data/article-covers.json','utf8'));
const usedFiles=new Set(), usedSourceHashes=new Set(), usedImageHashes=new Set(), articles=new Set();
for(const category of await fs.readdir(root))for(const file of await fs.readdir(`${root}/${category}`)){
 if(!file.endsWith('.mdx'))continue;
 const filename=`${root}/${category}/${file}`;
 const fm=YAML.parse((await fs.readFile(filename,'utf8')).split('---')[1]);
 if(fm.draft)continue;
 const article=`${category}/${file.slice(0,-4)}`, record=registry.find(r=>r.article===article);
 assert(record,`Missing cover provenance: ${article}`);
 assert(fm.image&&fm.coverAlt&&fm.coverCaption,`Missing image or descriptive metadata: ${article}`);
 const asset=path.resolve(path.dirname(filename),fm.image);
 assert.equal(asset,path.resolve(record.image),`Cover/provenance mismatch: ${article}`);
 assert.equal(fm.coverAlt,record.alt);
 assert.equal(fm.coverCaption,record.caption);
 assert(!usedFiles.has(asset),`Shared article cover: ${article}`);
 assert(!usedSourceHashes.has(record.sourceSha256),`Repeated source image: ${article}`);
 const hash=crypto.createHash('sha256').update(await fs.readFile(asset)).digest('hex');
 assert(!usedImageHashes.has(hash),`Duplicate image bytes: ${article}`);
 assert(new URL(record.sourceUrl).protocol==='https:'&&new URL(record.sourcePage).protocol==='https:');
 usedFiles.add(asset);usedSourceHashes.add(record.sourceSha256);usedImageHashes.add(hash);articles.add(article);
}
assert.equal(registry.length,articles.size,'Cover registry contains stale or duplicate articles');
console.log(`Verified ${articles.size} distinct article covers with descriptive metadata and source records.`);
