/// <reference types="astro/client" />
interface Window {
  __awLoadTrackers?: () => void;
  __awTrackersLoaded?: boolean;
}
