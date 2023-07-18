import { Drawer, Group, Radio, Stack, Switch } from "@mantine/core";

type SettingsViewType = {
  open: boolean;
  onClose: () => void;
};

const SettingsView = ({ open, onClose }: SettingsViewType) => {
  if (!open) return null;

  return (
    <Drawer
      position="top"
      size="100%"
      title="Settings"
      opened={true}
      onClose={onClose}>
      <Stack>
        <Switch.Group label="Display professor ratings...">
          <Group mt="xs">
            <Switch label="On webpages" />
          </Group>
        </Switch.Group>
        <Radio.Group label="Show more professor details...">
          <Group mt="xs">
            <Radio value="hover" label="On hover" />
            <Radio value="click" label="On click" />
          </Group>
        </Radio.Group>
        <Radio.Group label="Run...">
          <Group mt="xs">
            <Radio value="hover" label="Auto" />
            <Radio value="click" label="Only on..." />
            <Radio value="click" label="On all, expt..." />
          </Group>
        </Radio.Group>
      </Stack>
    </Drawer>
  );
};

export { SettingsView };
