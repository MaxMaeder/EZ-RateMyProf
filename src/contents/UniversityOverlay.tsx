import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Group,
  Paper,
  Text,
  TextInput,
  createEmotionCache
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type {
  PlasmoCSUIProps,
  PlasmoGetOverlayAnchor,
  PlasmoGetShadowHostId
} from "plasmo";
import type { FC } from "react";

import { OverlayCard } from "~components/OverlayCard";
import { ThemeProvider } from "~theme";

const styleElement = document.createElement("style");

const styleCache = createEmotionCache({
  key: "rmp-cache-university-overlay",
  prepend: true,
  container: styleElement
});

export const getStyle = () => styleElement;

const UniversityOverlay: FC<PlasmoCSUIProps> = () => {
  const [opened, { open, close }] = useDisclosure();

  return (
    <ThemeProvider emotionCache={styleCache}>
      <OverlayCard open={opened} onClose={close} sx={{ top: 10, right: 10 }}>
        <Text size="sm" mb="xs" weight={500}>
          Subscribe to email newsletter
        </Text>

        <Group align="flex-end">
          <TextInput placeholder="hello@gluesticker.com" sx={{ flex: 1 }} />
          <Button onClick={close}>Subscribe</Button>
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
