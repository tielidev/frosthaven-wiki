import { describe, expect, it } from 'vitest';
import { clampPan, clampZoom, frontierMap, markerMatches, validateMarkers } from '../src/lib/maps';
import { existsSync } from 'node:fs';

describe('frontier atlas', () => {
  it('publishes only sourced, bounded and uniquely identified markers', () => {
    expect(validateMarkers(frontierMap.markers)).toEqual([]);
    expect(existsSync(`public${frontierMap.background}`)).toBe(true);
    expect(frontierMap.markers.map(marker => marker.id)).toEqual(['frosthaven']);
  });
  it('rejects duplicate IDs, unverified coordinates and broken destinations', () => {
    const marker = frontierMap.markers[0];
    expect(validateMarkers([marker, { ...marker, x: NaN, y: 101, href: '//external/', source: '', notes: '' }])).toHaveLength(4);
  });
  it('matches every search token while preserving type and region filters', () => {
    const marker = frontierMap.markers[0];
    expect(markerMatches(marker, ' FROST haven ')).toBe(true);
    expect(markerMatches(marker, 'frost', 'frosthaven', 'settlement')).toBe(true);
    expect(markerMatches(marker, '', '', 'scenario')).toBe(false);
    expect(markerMatches(marker, 'missing')).toBe(false);
    expect(markerMatches(marker, '', 'unverified')).toBe(false);
  });
  it('bounds zoom and panning and recovers from non-finite input', () => {
    expect(clampZoom(0)).toBe(1);
    expect(clampZoom(8)).toBe(4);
    expect(clampZoom(NaN)).toBe(1);
    expect(clampPan(90, 800, 1)).toBe(0);
    expect(clampPan(900, 800, 2)).toBe(400);
    expect(clampPan(-900, 800, 2)).toBe(-400);
    expect(clampPan(Infinity, 800, 2)).toBe(0);
  });
});
