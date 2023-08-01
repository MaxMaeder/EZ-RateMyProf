import type { ExtensionSettings, MatcherItem } from "~hooks/useSettings";

// Time before re-showing a "nagging" pop-up
export const TIME_BEFORE_RESHOW = 24 * 60 * 60 * 1000; // 1 day, in ms

export const SENSIBLE_BLACKLIST: MatcherItem[] = [
  { pattern: "canvas.*.edu" },
  { pattern: "*wikipedia.*" },
  { pattern: "*google.*" },
  { pattern: "*ratemyprofessors.com" }
];

export const PROCEED_KEYWORDS = ["course", "schedule", "professor"];
export const TAG_BLACKLIST = ["STYLE", "SCRIPT", "NOSCRIPT", "BODY"];

export const DEFAULT_SETTINGS: ExtensionSettings = {
  showRatings: ["webpages"],
  showDetails: "click",
  runOn: "auto",
  whitelist: [],
  blacklist: SENSIBLE_BLACKLIST
};
