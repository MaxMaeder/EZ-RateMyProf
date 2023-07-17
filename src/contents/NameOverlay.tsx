import { Box, createEmotionCache } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import type {
  PlasmoCSUIProps,
  PlasmoGetOverlayAnchor,
  PlasmoGetShadowHostId
} from "plasmo";
import { type FC, useEffect, useState } from "react";
import { useClickAway } from "react-use";

import { OverlayCard } from "~components/OverlayCard";
import { ThemeProvider } from "~theme";

const styleElement = document.createElement("style");

const styleCache = createEmotionCache({
  key: "plasmo-mantine-cache",
  prepend: true,
  container: styleElement
});

export const getStyle = () => styleElement;

const NameOverlay: FC<PlasmoCSUIProps> = () => {
  const [id, setId] = useState<string>("");

  const [location, setLocation] = useState([0, 0]);
  const [visible, setVisible] = useState(false);

  /*const ref = useRef(null);
  useClickAway(ref, () => {
    console.log("outside");
    setVisible(false);
  });*/

  useEffect(() => {
    const hoverListener = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) return;
      if (!target.classList.contains("rate-inline")) return;

      setId(target.dataset.id || "");

      const { left, top } = target.getBoundingClientRect();
      setLocation([top, left]);
      setVisible(true);
    };

    const scrollListener = () => {
      setVisible(false);
    };

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
      <Box
        sx={{
          position: "fixed",
          top: "0px",
          left: "0px",
          right: "0px",
          bottom: "0px",
          pointerEvents: "none"
        }}>
        {visible && (
          <Box
            sx={{
              position: "absolute",
              top: Math.min(location[0], window.innerHeight - 270),
              left: Math.min(location[1] + 30, window.innerWidth - 310),
              pointerEvents: "auto"
            }}>
            <OverlayCard professorId={id} onClose={() => setVisible(false)} />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default NameOverlay;

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.body;

export const getShadowHostId: PlasmoGetShadowHostId = () => "name-overlay";
