import fs from 'node:fs/promises';
import sharp from 'sharp';
const dir='public/images/game';
await fs.mkdir(dir,{recursive:true});
const api=await fetch('https://store.steampowered.com/api/appdetails?appids=2347080&l=english');
if(!api.ok) throw new Error(`Steam ${api.status}`);
const data=(await api.json())['2347080'].data;
await fs.mkdir('src/data',{recursive:true});
await fs.writeFile('src/data/steam.json',JSON.stringify(data,null,2));
const images=[{name:'header',url:data.header_image},...data.screenshots.map((s,i)=>({name:`scene-${String(i+1).padStart(2,'0')}`,url:s.path_full}))];
const extras=[...data.detailed_description.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
for(let i=0;i<extras.length;i++)images.push({name:`feature-${i+1}`,url:extras[i]});
const manifest=[];
for(const asset of images){
 try{
 const res=await fetch(asset.url); if(!res.ok)throw new Error(`${res.status}`);
 const bytes=Buffer.from(await res.arrayBuffer()); const meta=await sharp(bytes,{animated:true}).metadata();
 const animated=(meta.pages||1)>1;
 const file=`${dir}/${asset.name}.${animated?'gif':'webp'}`;
 if(animated)await fs.writeFile(file,bytes);else await sharp(bytes).resize({width:1600,withoutEnlargement:true}).webp({quality:83}).toFile(file);
 if(!animated)await sharp(bytes).resize({width:680,withoutEnlargement:true}).webp({quality:78}).toFile(`${dir}/${asset.name}-small.webp`);
 manifest.push({...asset,path:`/${file.replace('public/','')}`,width:meta.width,height:animated?meta.pageHeight:meta.height,animated,source:'https://store.steampowered.com/app/2347080/Frosthaven/',rights:'Publisher promotional media; copyright remains with respective game rights holders. No independent asset license asserted.'});
 console.log(asset.name,meta.width,meta.height,animated?'animated':'still');
 }catch(e){console.warn(asset.name,e.message)}
}
await fs.writeFile('src/data/media.json',JSON.stringify(manifest,null,2));
await fs.mkdir('src/assets/game',{recursive:true});
for(const asset of manifest.filter(x=>!x.animated))await fs.copyFile(`public${asset.path}`,`src/assets/game/${asset.name}.webp`);
console.log(`Saved ${manifest.length} media assets`);
