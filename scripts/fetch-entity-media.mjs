import fs from 'node:fs/promises';
import sharp from 'sharp';
const data=JSON.parse(await fs.readFile('src/data/research.json','utf8'));
await fs.mkdir('public/images/entities',{recursive:true});
const log=[];
for(const category of ['classes','items','enemies','buildings'])for(const entry of data[category]){
 if(!entry.officialImage)continue;
 try{const r=await fetch(entry.officialImage);if(!r.ok)throw Error(String(r.status));const b=Buffer.from(await r.arrayBuffer());const meta=await sharp(b).metadata();const file=`/images/entities/${entry.slug}.webp`;await sharp(b).resize({width:1000,withoutEnlargement:true}).webp({quality:84}).toFile('public'+file);log.push({category,name:entry.name,path:file,url:entry.officialImage,width:meta.width,height:meta.height,sourceIds:entry.sourceIds,rights:'Official digital game promotional media; copyright remains with its owners.'});console.log(entry.slug);}catch(e){console.warn(entry.slug,e.message);}
}
await fs.writeFile('src/data/entity-media.json',JSON.stringify(log,null,2));
