import { clampZoom, clampPan, markerMatches } from '../lib/maps';

export function initializeMaps(): void {
  document.querySelectorAll<HTMLElement>('[data-atlas]').forEach(root => {
    if (root.classList.contains('is-enhanced')) return;
    const viewport = root.querySelector<HTMLElement>('[data-map-viewport]');
    const artwork = root.querySelector<HTMLElement>('[data-map-artwork]');
    if (!viewport || !artwork) return;
    root.classList.add('is-enhanced');
    root.dataset.view = 'map';
    root.querySelectorAll<HTMLElement>('[data-map-tabs],[data-map-controls]').forEach(element => { element.hidden = false; });
    const markers = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-map-marker]'));
    const entries = Array.from(root.querySelectorAll<HTMLElement>('[data-map-entry]'));
    const search = root.querySelector<HTMLInputElement>('[data-map-search]');
    if (search) search.value = new URLSearchParams(location.search).get('q') || '';
    const region = root.querySelector<HTMLSelectElement>('[data-map-region]');
    const type = root.querySelector<HTMLSelectElement>('[data-map-type]');
    let scale = 1, x = 0, y = 0, moved = false;
    const pointers = new Map<number, { x: number; y: number }>();
    let previousDistance = 0;

    const render = () => {
      scale = clampZoom(scale);
      x = clampPan(x, viewport.clientWidth, scale);
      y = clampPan(y, viewport.clientHeight, scale);
      artwork.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
      artwork.style.setProperty('--marker-scale', String(1 / scale));
      const output = root.querySelector('output');
      if (output) output.textContent = `${Math.round(scale * 100)}%`;
    };
    const zoom = (next: number, focalX = 0, focalY = 0) => {
      const value = clampZoom(next);
      x = focalX - (focalX - x) * value / scale;
      y = focalY - (focalY - y) * value / scale;
      scale = value;
      render();
    };
    const chooseView = (view: string) => {
      root.dataset.view = view;
      root.querySelectorAll<HTMLElement>('[data-map-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mapView === view)));
      if (view === 'map') render();
    };
    const close = () => {
      root.querySelectorAll<HTMLElement>('[data-map-popup]').forEach(popup => { popup.hidden = true; });
      markers.forEach(marker => { marker.classList.remove('is-selected'); marker.setAttribute('aria-expanded', 'false'); });
    };
    const select = (id: string, updateUrl = true) => {
      const marker = markers.find(candidate => candidate.dataset.mapMarker === id);
      if (!marker || marker.hidden) return;
      chooseView('map');
      close();
      scale = 2;
      x = (50 - Number(marker.dataset.x)) / 100 * viewport.clientWidth * scale;
      y = (50 - Number(marker.dataset.y)) / 100 * viewport.clientHeight * scale;
      render();
      marker.classList.add('is-selected');
      marker.setAttribute('aria-expanded', 'true');
      root.querySelectorAll<HTMLElement>('[data-map-popup]').forEach(popup => { popup.hidden = popup.dataset.mapPopup !== id; });
      if (updateUrl) {
        const url = new URL(location.href);
        url.searchParams.set('location', id);
        history.replaceState(null, '', url);
      }
    };
    const filter = () => {
      let count = 0;
      entries.forEach(entry => {
        const matches = markerMatches({ title: entry.dataset.title || '', region: entry.dataset.region || '', type: entry.dataset.type || '' }, search?.value || '', region?.value, type?.value);
        entry.hidden = !matches;
        if (matches) count++;
        const marker = markers.find(candidate => candidate.dataset.mapMarker === entry.dataset.id);
        if (marker) marker.hidden = !matches;
      });
      const counter = root.querySelector('[data-map-count]');
      if (counter) counter.textContent = String(count);
      const empty = root.querySelector<HTMLElement>('[data-map-empty]');
      if (empty) empty.hidden = count > 0;
      close();
    };
    search?.addEventListener('input', filter);
    region?.addEventListener('change', filter);
    type?.addEventListener('change', filter);
    root.querySelectorAll<HTMLElement>('[data-map-view]').forEach(button => button.addEventListener('click', () => chooseView(button.dataset.mapView || 'map')));
    root.querySelectorAll<HTMLElement>('[data-map-action]').forEach(button => button.addEventListener('click', () => {
      if (button.dataset.mapAction === 'reset') { x = 0; y = 0; scale = 1; close(); render(); }
      else zoom(scale * (button.dataset.mapAction === 'in' ? 1.3 : 1 / 1.3));
    }));
    markers.forEach(marker => {
      marker.setAttribute('aria-expanded', 'false');
      marker.addEventListener('click', event => { event.preventDefault(); if (!moved || event.detail === 0) select(marker.dataset.mapMarker || ''); });
    });
    root.querySelectorAll<HTMLAnchorElement>('[data-map-locate]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); select(link.dataset.mapLocate || ''); }));
    root.querySelectorAll<HTMLElement>('[data-map-close]').forEach(button => button.addEventListener('click', () => { close(); viewport.focus({ preventScroll: true }); }));
    viewport.addEventListener('wheel', event => {
      event.preventDefault();
      const bounds = viewport.getBoundingClientRect();
      zoom(scale * Math.exp(-event.deltaY * .0015), event.clientX - bounds.left - bounds.width / 2, event.clientY - bounds.top - bounds.height / 2);
    }, { passive: false });
    viewport.addEventListener('pointerdown', event => {
      if ((event.target as Element).closest('[data-map-controls]')) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      moved = false;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      previousDistance = 0;
      if (!(event.target as Element).closest('a')) viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointermove', event => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const dx = event.clientX - previous.x, dy = event.clientY - previous.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) { moved = true; viewport.classList.add('is-dragging'); }
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size >= 2) {
        const [a, b] = Array.from(pointers.values());
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        const bounds = viewport.getBoundingClientRect();
        if (previousDistance) zoom(scale * distance / previousDistance, (a.x + b.x) / 2 - bounds.left - bounds.width / 2, (a.y + b.y) / 2 - bounds.top - bounds.height / 2);
        previousDistance = distance;
      } else { x += dx; y += dy; render(); }
    });
    const release = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      previousDistance = 0;
      if (!pointers.size) viewport.classList.remove('is-dragging');
    };
    viewport.addEventListener('pointerup', release);
    viewport.addEventListener('pointercancel', release);
    viewport.addEventListener('lostpointercapture', release);
    viewport.addEventListener('keydown', event => {
      if (event.target !== viewport) return;
      if (['+', '=', '-', '0', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) event.preventDefault();
      if (event.key === '+' || event.key === '=') zoom(scale * 1.3);
      else if (event.key === '-') zoom(scale / 1.3);
      else if (event.key === '0') { scale = 1; x = y = 0; render(); }
      else if (event.key === 'Escape') close();
      else {
        if (event.key === 'ArrowLeft') x += 40;
        if (event.key === 'ArrowRight') x -= 40;
        if (event.key === 'ArrowUp') y += 40;
        if (event.key === 'ArrowDown') y -= 40;
        render();
      }
    });
    new ResizeObserver(render).observe(viewport);
    filter();
    select(new URLSearchParams(location.search).get('location') || '', false);
    render();
  });
}
