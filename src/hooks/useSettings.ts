import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";

import { DEFAULT_SETTINGS } from "~config/constants";

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

const parseStoreSettings = (s: string): ExtensionSettings => {
  const userSettings = JSON.parse(s || "{}");

  const settings: ExtensionSettings = Object.assign(
    { ...DEFAULT_SETTINGS },
    userSettings
  );

  return settings;
};

const useSettings = (): [ExtensionSettings, (s: ExtensionSettings) => void] => {
  const [settingsStore, setSettingsStore] = useStorage("settings");

  const settings = parseStoreSettings(settingsStore);

  const setSettings = (s: ExtensionSettings) => {
    setSettingsStore(JSON.stringify(s));
  };

  return [settings, setSettings];
};

const getSettings = async (): Promise<ExtensionSettings> => {
  const storage = new Storage();
  const settingsStore = await storage.get("settings");

  return parseStoreSettings(settingsStore);
};

const setSettings = async (s: ExtensionSettings) => {
  const storage = new Storage();

  await storage.set("settings", JSON.stringify(s));
};

export type {
  ShowRatingsLocation,
  ShowDetailsType,
  RunOnType,
  MatcherItem,
  ExtensionSettings
};

export { useSettings, getSettings, setSettings };
