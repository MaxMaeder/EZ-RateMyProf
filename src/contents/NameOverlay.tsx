import { createEmotionCache } from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import type {
  PlasmoCSUIProps,
  PlasmoGetOverlayAnchor,
  PlasmoGetShadowHostId
} from "plasmo";
import { type FC, useCallback, useEffect, useRef, useState } from "react";

import { OverlayCard } from "~components/OverlayCard";
import { ProfDetails } from "~components/ProfDetails";
import { useSettings } from "~hooks/useSettings";
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
  const preTargetRef = useRef<HTMLElement>();

  const [location, setLocation] = useState([0, 0]);
  const [opened, { open, close }] = useDisclosure();

  // Without this closing the popup doesn't work :(
  const openedRef = useRef<boolean>();
  useEffect(() => {
    openedRef.current = opened;
  }, [opened]);

  const [settings] = useSettings();

  useClickOutside(close, null, [
    ...document.querySelectorAll<HTMLElement>("plasmo-csui"),
    ...document.querySelectorAll<HTMLElement>(".rate-inline")
  ]);

  const showListener = useCallback((event: MouseEvent) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("rate-inline")) return;
    event.preventDefault();

    // If popup already open & click mode, close
    if (
      event instanceof PointerEvent &&
      openedRef.current &&
      preTargetRef.current === target
    ) {
      close();
      openedRef.current = false;
      return;
    }

    setId(target.dataset.id || "");

    const { top, left } = target.getBoundingClientRect();
    setLocation([top, left]);
    open();

    preTargetRef.current = target;
  }, []);

  useEffect(() => {
    const scrollListener = () => close();

    const showEvent = settings.showDetails === "hover" ? "mouseover" : "click";

    document.body.addEventListener(showEvent, showListener);
    document.addEventListener("scroll", scrollListener);
    document.addEventListener("resize", scrollListener);

    return () => {
      document.body.removeEventListener(showEvent, showListener);
      document.removeEventListener("scroll", scrollListener);
      document.removeEventListener("resize", scrollListener);
    };
  }, [settings.showDetails]);

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
