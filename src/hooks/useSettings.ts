import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";

import { SENSIBLE_BLACKLIST } from "~config/constants";

type ShowRatingsLocation = "webpages";
type ShowDetailsType = "hover" | "click";
type RunOnType = "auto" | "whitelist" | "blacklist";
type MatcherItem = {
  id?: string;
  pattern: string;
};

type ExtensionSettings = {
  showRatings: ShowRatingsLocation[];
  showDetails: ShowDetailsType;
  runOn: RunOnType;
  whitelist: MatcherItem[];
  blacklist: MatcherItem[];
};

const defaultSettings: ExtensionSettings = {
  showRatings: ["webpages"],
  showDetails: "hover",
  runOn: "auto",
  whitelist: [],
  blacklist: SENSIBLE_BLACKLIST
};

const parseStoreSettings = (s: string): ExtensionSettings => {
  const userSettings = JSON.parse(s || "{}");

  const settings: ExtensionSettings = Object.assign(
    { ...defaultSettings },
    userSettings
  );

  return settings;
};

const useSettings = (): [ExtensionSettings, (s: ExtensionSettings) => void] => {
  const [settingsStore, setSettingsStore] = useStorage("settings");

  const settings = parseStoreSettings(settingsStore);

  const setSettings = (s: ExtensionSettings) => {
    //console.log("writing");
    setSettingsStore(JSON.stringify(s));
  };

  return [settings, setSettings];
};

const getSettings = async (): Promise<ExtensionSettings> => {
  const storage = new Storage();
  const settingsStore = await storage.get("settings");

  return parseStoreSettings(settingsStore);
};

export type {
  ShowRatingsLocation,
  ShowDetailsType,
  RunOnType,
  MatcherItem,
  ExtensionSettings
};

export { useSettings, getSettings };
