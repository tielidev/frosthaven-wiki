/// <reference types="astro/client" />
interface Window {
  __awLoadTrackers?: () => void;
  __awStopTrackers?: () => void;
  __awTrackersLoaded?: boolean;
}
