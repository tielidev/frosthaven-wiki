import data from '../data/maps.json';

export interface MapMarker {
  id: string;
  title: string;
  x: number;
  y: number;
  region: string;
  type: string;
  href: string;
  source: string;
  notes: string;
}

export const frontierMap = data;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;

export function clampZoom(value: number): number {
  return Number.isFinite(value) ? Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value)) : MIN_ZOOM;
}

/** Offsets are viewport pixels; never let a pan reveal space beyond the artwork. */
export function clampPan(value: number, viewportSize: number, scale: number): number {
  const limit = Math.max(0, viewportSize * (clampZoom(scale) - 1) / 2);
  return Number.isFinite(value) ? Math.max(-limit, Math.min(limit, value)) : 0;
}

export function markerMatches(marker: Pick<MapMarker, 'title' | 'region' | 'type'>, query: string, region = '', type = ''): boolean {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const haystack = `${marker.title} ${marker.region} ${marker.type}`.toLocaleLowerCase();
  return (!region || marker.region === region) && (!type || marker.type === type) && words.every(word => haystack.includes(word));
}

export function validateMarkers(markers: MapMarker[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const marker of markers) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(marker.id) || ids.has(marker.id)) errors.push(`Invalid or duplicate marker: ${marker.id}`);
    ids.add(marker.id);
    if (![marker.x, marker.y].every(n => Number.isFinite(n) && n >= 0 && n <= 100)) errors.push(`Coordinates out of range: ${marker.id}`);
    if (!marker.href.startsWith('/') || !marker.href.endsWith('/') || marker.href.startsWith('//')) errors.push(`Invalid internal destination: ${marker.id}`);
    if (!marker.source.startsWith('https://') || !marker.notes.trim()) errors.push(`Missing provenance: ${marker.id}`);
  }
  return errors;
}
