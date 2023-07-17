import { Drawer } from "@mantine/core";

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
      onClose={onClose}></Drawer>
  );
};

export { SettingsView };
