import {
  Anchor,
  Drawer,
  Group,
  Paper,
  Radio,
  Stack,
  Switch,
  Text
} from "@mantine/core";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Storage } from "@plasmohq/storage";

import { MatcherList } from "~components/MatcherList";
import {
  type ExtensionSettings,
  type RunOnType,
  type ShowRatingsLocation,
  defaultSettings,
  getSettings,
  setSettings
} from "~hooks/useSettings";

type SettingsViewType = {
  open: boolean;
  onClose: () => void;
};

const SettingsView = ({ open, onClose }: SettingsViewType) => {
  const {
    handleSubmit,
    watch,
    control,
    reset: resetForm
  } = useForm({
    defaultValues: async () => (await getSettings()) as any
  });

  const onSubmit = (data: ExtensionSettings) => setSettings(data);
  useEffect(() => {
    const subscription = watch(() => handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, []);

  const clearStorage = useCallback(async () => {
    const storage = new Storage();
    await storage.clear();
    resetForm(defaultSettings);
  }, []);

  const showRatings = (watch("showRatings") || []) as ShowRatingsLocation[];
  const webpEn = showRatings.includes("webpages");

  if (!open) return null;

  const RunOnList = () => {
    if (!webpEn) return null;

    const runOn = watch("runOn") as RunOnType;

    return (
      <>
        <MatcherList
          label="Whitelist"
          name="whitelist"
          control={control}
          hidden={runOn !== "whitelist"}
        />
        <MatcherList
          label="Blacklist"
          name="blacklist"
          control={control}
          hidden={runOn !== "blacklist"}
        />
      </>
    );
  };

  return (
    <Drawer
      position="top"
      size="100%"
      title="Settings"
      opened={true}
      onClose={onClose}>
      <form>
        <Stack>
          <Controller
            name="showRatings"
            control={control}
            render={({ field }) => (
              <Switch.Group label="Display professor ratings..." {...field}>
                <Group mt="xs">
                  <Switch value="webpages" label="On webpages" />
                </Group>
              </Switch.Group>
            )}
          />
          <Controller
            name="showDetails"
            control={control}
            render={({ field }) => (
              <Radio.Group label="Show more professor details..." {...field}>
                <Group mt="xs">
                  <Radio value="hover" label="On hover" disabled={!webpEn} />
                  <Radio value="click" label="On click" disabled={!webpEn} />
                </Group>
              </Radio.Group>
            )}
          />
          <Controller
            name="runOn"
            control={control}
            render={({ field }) => (
              <Radio.Group label="Run..." {...field}>
                <Group mt="xs">
                  <Radio value="auto" label="Auto" disabled={!webpEn} />
                  <Radio
                    value="whitelist"
                    label="Only on..."
                    disabled={!webpEn}
                  />
                  <Radio
                    value="blacklist"
                    label="On all, expt..."
                    disabled={!webpEn}
                  />
                </Group>
              </Radio.Group>
            )}
          />
          <RunOnList />
          <Paper withBorder p="xs" mt="md">
            <Text c="dimmed" align="center">
              Made by{" "}
              <Anchor
                color="dimmed"
                href="https://www.linkedin.com/in/maxmaeder/"
                target="_blank">
                Max Maeder
              </Anchor>
              <Text span display="block" mt="xs">
                <Anchor
                  href="https://github.com/MaxMaeder/EZ-RateMyProf"
                  target="_blank">
                  GitHub
                </Anchor>
                {" · "}
                <Anchor onClick={clearStorage}>Reset Data</Anchor>
              </Text>
            </Text>
          </Paper>
        </Stack>
      </form>
    </Drawer>
  );
};

export { SettingsView };
