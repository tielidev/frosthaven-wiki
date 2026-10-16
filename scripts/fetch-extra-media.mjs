import fs from 'node:fs/promises';
import sharp from 'sharp';
const base='https://cdn.playfrosthaven.com/fhv_assets/';
const data=JSON.parse(await fs.readFile('src/data/steam.json','utf8'));
const jobs=[['logo.webp',base+'images/logos/header_logo.webp'],['hero.webp',base+'images/home/introduction/bg2.png'],['about.webp',base+'images/about/about.webp'],['geminate.webp',base+'images/home/hero/Geminate.webp'],['favicon-original.ico',base+'favicon.ico']];
for(const [i,m]of [...data.detailed_description.matchAll(/<video[^>]*poster="([^"]+)"[^>]*>[\s\S]*?<source src="([^"]+\.webm[^\"]*)"/g)].entries()){
jobs.push([`loop-${i+1}.webm`,m[2]],[`loop-${i+1}.webp`,m[1]]);
}
const log=[];
for(const [name,url]of jobs){try{const r=await fetch(url);if(!r.ok)throw Error(String(r.status));const b=Buffer.from(await r.arrayBuffer());if(/\.webp$/.test(name))await sharp(b).resize({width:1920,withoutEnlargement:true}).webp({quality:85}).toFile('public/images/game/'+name);else await fs.writeFile('public/images/game/'+name,b);log.push({name,url,source:'https://www.playfrosthaven.com/en',rights:'Official promotional material; rights reserved by game owners.'});console.log(name,b.length);}catch(e){console.warn(name,e.message)}}
await fs.writeFile('src/data/extra-media.json',JSON.stringify(log,null,2));
await fs.copyFile('public/images/game/hero.webp','public/images/hero.webp');
const ico=await fs.readFile('public/images/game/favicon-original.ico');
const count=ico.readUInt16LE(4);const entries=[];for(let i=0;i<count;i++){const o=6+i*16;entries.push({w:ico[o]||256,len:ico.readUInt32LE(o+8),off:ico.readUInt32LE(o+12)});}entries.sort((a,b)=>b.w-a.w);
let icon;for(const e of entries){const b=ico.subarray(e.off,e.off+e.len);if(b.subarray(1,4).toString()==='PNG'){icon=b;break;}}
if(icon){for(const [size,name]of [[96,'favicon-96x96.png'],[32,'favicon-32x32.png'],[16,'favicon-16x16.png'],[180,'apple-touch-icon.png'],[192,'android-chrome-192x192.png'],[512,'android-chrome-512x512.png']])await sharp(icon).resize(size,size).png().toFile('public/'+name);await fs.writeFile('public/favicon.ico',ico);console.log('Official icon exported');}else console.warn('ICO PNG frame missing; icon conversion required');
