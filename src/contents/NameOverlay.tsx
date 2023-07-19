import { createEmotionCache } from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import type {
  PlasmoCSUIProps,
  PlasmoGetOverlayAnchor,
  PlasmoGetShadowHostId
} from "plasmo";
import { type FC, useEffect, useState } from "react";

import { OverlayCard } from "~components/OverlayCard";
import { ProfDetails } from "~components/ProfDetails";
import { ThemeProvider } from "~theme";

const styleElement = document.createElement("style");

const styleCache = createEmotionCache({
  key: "rmp-cache-name-overlay",
  prepend: true,
  container: styleElement
});

export const getStyle = () => styleElement;

const NameOverlay: FC<PlasmoCSUIProps> = () => {
  const [id, setId] = useState<string>("");

  const [location, setLocation] = useState([0, 0]);
  const [opened, { open, close }] = useDisclosure();

  useClickOutside(close, null, [
    ...document.querySelectorAll<HTMLElement>("plasmo-csui")
  ]);

  useEffect(() => {
    const hoverListener = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) return;
      if (!target.classList.contains("rate-inline")) return;

      setId(target.dataset.id || "");

      const { top, left } = target.getBoundingClientRect();
      setLocation([top, left]);
      open();
    };

    const scrollListener = () => close();

    document.body.addEventListener("mouseover", hoverListener);
    document.addEventListener("scroll", scrollListener);
    document.addEventListener("resize", scrollListener);

    return () => {
      document.body.removeEventListener("mouseover", hoverListener);
      document.removeEventListener("scroll", scrollListener);
      document.removeEventListener("resize", scrollListener);
    };
  }, []);

  return (
    <ThemeProvider emotionCache={styleCache}>
      <OverlayCard
        open={opened}
        onClose={close}
        position={{ top: location[0], left: location[1] + 30 }}
        sx={{ width: "325px", minHeight: "260px" }}>
        <ProfDetails professorId={id} />
      </OverlayCard>
    </ThemeProvider>
  );
};

export default NameOverlay;

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.body;

export const getShadowHostId: PlasmoGetShadowHostId = () => "name-overlay";
