import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import YAML from 'yaml';
import data from '../src/data/research.json';
import { NAVIGATION_CONFIG } from '../src/config/navigation';
import { site } from '../src/config/site';
import { organizationJsonLd, websiteJsonLd } from '../src/lib/seo';
describe('Frosthaven publication',()=>{
 it('publishes matching sourced references and builds for all 17 classes',()=>{
  expect(data.classes).toHaveLength(17);expect(new Set(data.classes.map(c=>c.slug)).size).toBe(17);expect(data.classes.filter(c=>c.starting)).toHaveLength(6);
  for(const c of data.classes)for(const type of ['classes','builds']){const source=fs.readFileSync(`src/content/wiki/en/${type}/${c.slug}.mdx`,'utf8');const front=YAML.parse(source.split('---')[1]);expect(front.draft).not.toBe(true);expect(front.category).toBe(type);expect(source).toContain('## Sources and version notes');}
 });
 it('uses the real wiki identity without impersonating the publisher',()=>{expect(site.domain).toBe('frosthaven.wiki');expect(organizationJsonLd().sameAs).toBeUndefined();expect(websiteJsonLd().inLanguage).toBe('en');expect(site.legalNotice).toContain('independent');});
 it('has the ten agreed first-level sections including maps',()=>{expect(NAVIGATION_CONFIG.map(n=>n.key)).toEqual(['guides','classes','builds','maps','scenarios','items','enemies','outpost','mechanics','news']);});
 it('only references registered evidence sources',()=>{const ids=new Set(data.sources.map(s=>s.id));for(const c of [...data.classes,...data.guides,...data.items,...data.scenarios])for(const id of c.sourceIds)expect(ids.has(id)).toBe(true);});
 it('keeps game-asset license boundaries explicit',()=>{expect(fs.readFileSync('src/pages/editorial.astro','utf8')).toContain('does not grant rights to game artwork');});
});
