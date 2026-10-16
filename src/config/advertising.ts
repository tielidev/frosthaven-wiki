const preview = process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main';
export const adProvider = preview ? 'none' : (import.meta.env.PUBLIC_AD_PROVIDER || 'adsterra');
export const adSlots = {
  leaderboard: import.meta.env.PUBLIC_ADSTERRA_SLOT_INCONTENT_728X90 || '',
  rectangle: import.meta.env.PUBLIC_ADSTERRA_SLOT_SIDEBAR_300X250 || '',
};
export const adsEnabled = !preview && (adProvider === 'adsterra'
  ? Boolean(adSlots.leaderboard || adSlots.rectangle)
  : adProvider === 'adsense' && Boolean(import.meta.env.PUBLIC_ADSENSE_CLIENT));
