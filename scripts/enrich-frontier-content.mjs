import fs from 'node:fs/promises';
import YAML from 'yaml';
const data=JSON.parse(await fs.readFile('src/data/research.json','utf8'));
const entities=JSON.parse(await fs.readFile('src/data/entity-media.json','utf8'));
const root='src/content/wiki/en';
const source=ids=>ids.map(id=>data.sources.find(s=>s.id===id)).filter(Boolean).map(s=>`- [${s.title}](${s.url}) — ${s.scope}`).join('\n');
const change=async(path,fn)=>fs.writeFile(path,fn(await fs.readFile(path,'utf8')));
for(const c of data.classes){
 const path=`${root}/classes/${c.slug}.mdx`;
 await change(path,s=>{
  if(c.verifiedDigitalCards?.length)s=s.replace('## What commonly goes wrong?',`## Which cards are named in digital sources?\n\nThese names are corroborated by official digital announcements. Their current level, full wording and unlock requirements should be checked in the in-game Codex.\n\n${c.verifiedDigitalCards.map(card=>`- **${card.name}** — [official digital reference](${data.sources.find(x=>x.id===card.sourceIds[0])?.url}).`).join('\n')}\n\n## What commonly goes wrong?`);
  if(c.officialVideo)s=s.replace('gameVersion: Digital 1.0',`videos:\n  - ${c.officialVideo}\ngameVersion: Digital 1.0`);
  return s;
 });
}
await change(`${root}/scenarios/scenario-index.mdx`,s=>s.replace(/^\| (\d+) \| (.+) \| \[Search official patch notes\]\([^)]+\) \|/gm,(_,num,name)=>{const record=data.scenarios.find(x=>x.number===Number(num));const url=data.sources.find(x=>x.id===record?.sourceIds[0])?.url||'https://steamcommunity.com/app/2347080/allnews/';return `| <span id="scenario-${num}"></span>${num} | ${name} | [Official digital reference](${url}) |`;}));
for(const file of ['frosthaven-1-0-release','digital-1-0-changes'])await change(`${root}/news/${file}.mdx`,s=>s.replace('date: 2026-10-16','date: 2026-10-15'));
const enemySections=[];
for(const enemy of data.enemies){
 const image=entities.find(x=>x.category==='enemies'&&x.name===enemy.name);
 const ref=data.sources.find(s=>s.id===enemy.sourceIds[0]);
 if(enemy.summary&&enemy.tactics&&image){
  const description=`${enemy.name} in Frosthaven digital: behavior, tactical priorities and official reference. Check current game statistics before fighting.`;
  const fm={title:`${enemy.name}: behavior and tactical priorities`,description,category:'enemies',date:'2026-10-16',lastModified:'2026-10-16',gameVersion:'Digital 1.0',tags:['enemies',(enemy.faction||'digital').toLowerCase()],image:'../../../../assets/game/scene-08.webp',summary:enemy.summary};
  const body=`<figure><img src="${image.path}" alt="${enemy.name} in the official Frosthaven digital monster spotlight" width="${Math.min(1000,image.width)}" height="${Math.round(image.height*Math.min(1000,image.width)/image.width)}" loading="lazy" /><figcaption>Official digital monster spotlight artwork.</figcaption></figure>\n\n## What does ${enemy.name} do?\n\n${enemy.summary}\n\n## How should your party respond?\n\n${enemy.tactics}\n\nInspect the revealed action before selecting your final movement. Decide whether your contribution removes the threat now, prevents its next attack, or leaves an ally to absorb it. The value of a control or defensive action depends on the action this enemy is actually about to perform, not only its health.\n\n## Which statistics should you verify in game?\n\nCheck the scenario level, normal or elite status, current health, movement and any printed special properties in the digital interface. This reference does not substitute a fixed tabletop stat block for the current digital enemy. A historical patch note is evidence that a change was announced, not a guarantee that a particular edge case is resolved in every present situation.\n\n## How do you prepare a reliable response?\n\nChoose a position that preserves a second useful action if your intended target dies before your initiative. Coordinate limited space with summons and other melee heroes. Avoid spending a permanent loss solely to increase damage when the same objective can be reached through ordinary actions and safer positioning.\n\nReview [enemy action planning](/mechanics/enemy-actions/), match your tools to the [class library](/classes/), and inspect the [scenario index](/scenarios/scenario-index/) before leaving the outpost.\n\n## Sources and version notes\n\nResearched October 16, 2026. ${enemy.evidenceStatus}\n\n${source(enemy.sourceIds)}\n`;
  await fs.writeFile(`${root}/enemies/${enemy.slug}.mdx`,`---\n${YAML.stringify(fm)}---\n\n${body}`);
  enemySections.push(`### ${enemy.name}\n\n![${enemy.name} official digital spotlight](${image.path})\n\n${enemy.summary} ${enemy.tactics}\n\n[Read the ${enemy.name} field notes](/enemies/${enemy.slug}/).`);
 }else enemySections.push(`### ${enemy.name}\n\nDigital name confirmed. Current level-specific statistics remain subject to in-game inspection. [Official reference](${ref?.url||'https://steamcommunity.com/app/2347080/allnews/'}).`);
}
await change(`${root}/enemies/enemy-field-guide.mdx`,s=>s.replace(/## Which named enemies[\s\S]*?## How do you avoid/,`## Which enemies are documented in digital sources?\n\n${enemySections.join('\n\n')}\n\n## How do you avoid`));
await change(`${root}/outpost/buildings.mdx`,s=>s.replace(/## Which buildings[\s\S]*?## How do you choose/,`## Which buildings are confirmed by digital sources?\n\n${data.buildings.map(b=>`### ${b.name}\n\n${b.summary}\n\n${b.evidenceStatus}\n\n[Official source](${data.sources.find(s=>s.id===b.sourceIds[0])?.url}).`).join('\n\n')}\n\n## How do you choose`));
for(const category of ['outpost','mechanics','guides'])for(const file of (await fs.readdir(`${root}/${category}`)).slice(0,category==='guides'?3:2))await change(`${root}/${category}/${file}`,s=>{const close=s.indexOf('---',3)+3;return s.slice(0,close)+"\n\nimport LoopMedia from '~/components/media/LoopMedia.astro';\n"+s.slice(close).replace('## Sources and version notes',`<LoopMedia index={${category==='outpost'?3:2}} title="${category==='outpost'?'Official outpost preview':'Official tactical combat preview'}" />\n\n## Sources and version notes`);});
console.log(`Integrated ${data.scenarios.length} scenario identities and ${entities.length} official monster images.`);
