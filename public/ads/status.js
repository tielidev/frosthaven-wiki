// A loaded vendor iframe is a rendering signal, not proof of a paid impression.
(() => {
  const unit = document.body.dataset.adUnit;
  let rendered = false;
  let timer;
  const report = (state, reason = '') => {
    if (window.parent !== window) window.parent.postMessage({
      channel: 'frosthaven-ad-status', unit, state, reason,
    }, window.location.origin);
  };
  const watched = new WeakSet();
  const inspect = () => document.querySelectorAll('iframe').forEach(frame => {
    if (watched.has(frame)) return;
    watched.add(frame);
    frame.addEventListener('load', () => {
      if (!frame.getAttribute('src') && !frame.hasAttribute('srcdoc')) return;
      rendered = true;
      clearTimeout(timer);
      report('frame-loaded');
    });
  });
  new MutationObserver(inspect).observe(document.body, { childList: true, subtree: true });
  inspect();
  document.addEventListener('error', event => {
    if (event.target instanceof HTMLScriptElement && event.target.hasAttribute('data-ad-vendor') && !rendered) {
      report('error', 'script-error');
    }
  }, true);
  timer = setTimeout(() => {
    if (!rendered) report('unavailable', 'no-loaded-frame');
  }, 12000);
})();
