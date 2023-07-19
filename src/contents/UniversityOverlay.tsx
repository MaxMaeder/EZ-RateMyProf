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

import { ThemeProvider } from "~theme";

const styleElement = document.createElement("style");

const styleCache = createEmotionCache({
  key: "rmp-cache-university-overlay",
  prepend: true,
  container: styleElement
});

export const getStyle = () => styleElement;

const UniversityOverlay: FC<PlasmoCSUIProps> = () => {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <ThemeProvider emotionCache={styleCache}>
      <Box
        sx={{
          position: "fixed",
          top: "0px",
          left: "0px",
          right: "0px",
          bottom: "0px",
          pointerEvents: "none"
        }}>
        <Paper
          shadow="md"
          p="md"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            pointerEvents: "auto"
          }}>
          <Flex justify="right">
            <CloseButton />
          </Flex>
          <Text size="sm" mb="xs" weight={500}>
            Subscribe to email newsletter
          </Text>

          <Group align="flex-end">
            <TextInput placeholder="hello@gluesticker.com" sx={{ flex: 1 }} />
            <Button onClick={close}>Subscribe</Button>
          </Group>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default UniversityOverlay;

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.body;

export const getShadowHostId: PlasmoGetShadowHostId = () =>
  "university-overlay";
