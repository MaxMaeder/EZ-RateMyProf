import { Button, Group, Text, createEmotionCache } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type {
  PlasmoCSUIProps,
  PlasmoGetOverlayAnchor,
  PlasmoGetShadowHostId
} from "plasmo";
import { type FC, useCallback, useEffect } from "react";

import { useMessage } from "@plasmohq/messaging/hook";
import { useStorage } from "@plasmohq/storage/hook";

import { OverlayCard } from "~components/OverlayCard";
import { UniversitySelect } from "~components/UniversitySelect";
import { TIME_BEFORE_RESHOW } from "~config/constants";
import { showUnivOverlayMsg } from "~config/messages";
import { ThemeProvider } from "~theme";

const styleElement = document.createElement("style");

const styleCache = createEmotionCache({
  key: "rmp-cache-university-overlay",
  prepend: true,
  container: styleElement
});

export const getStyle = () => styleElement;

const UniversityOverlay: FC<PlasmoCSUIProps> = () => {
  const [university, setUniversity] = useStorage("university");
  const [lastShown, setLastShown] = useStorage("univ_ovl_last_shown");

  const [opened, { open, close }] = useDisclosure(false);

  const shouldShowAgain = useCallback(() => {
    let currTime = Date.now();
    let lastTime = Number.parseInt(lastShown) || 0;
    let showAgain = currTime - lastTime > TIME_BEFORE_RESHOW;

    if (showAgain) setLastShown(currTime);

    return showAgain;
  }, [lastShown, setLastShown]);

  const { data } = useMessage<string, string>(async (_, res) => {
    res.send(null);
  });

  if (data === showUnivOverlayMsg && !opened && shouldShowAgain()) open();

  const handleSave = () => {
    window.location.reload();
  };

  return (
    <ThemeProvider emotionCache={styleCache}>
      <OverlayCard open={opened} onClose={close} sx={{ top: 10, right: 10 }}>
        <Text size="md" weight={500}>
          Select Your University
        </Text>
        <Text size="sm" c="dimmed" mb="sm">
          to Display professor ratings
        </Text>

        <Group align="flex-end">
          <UniversitySelect
            label=""
            value={university}
            onChange={(u) => setUniversity(u)}
          />
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </OverlayCard>
    </ThemeProvider>
  );
};

export default UniversityOverlay;

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.body;

export const getShadowHostId: PlasmoGetShadowHostId = () =>
  "university-overlay";
