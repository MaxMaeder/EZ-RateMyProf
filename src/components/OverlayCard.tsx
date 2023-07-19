import { ActionIcon, Box, type BoxProps, Flex, Image } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import Logo from "data-base64:~assets/Logo.svg";
import { X as XIcon } from "tabler-icons-react";

type OverlayPosProps = {
  top: number;
  left: number;
};

interface OverlayCardProps extends BoxProps {
  open: boolean;
  onClose: () => void;
  position: OverlayPosProps | undefined;
  pageGap: number; // Min space between overlay and edge of page, pixels
}

const OverlayCard = ({
  open,
  onClose,
  position,
  pageGap = 10,
  sx,
  children,
  ...props
}: OverlayCardProps) => {
  const { ref: sizeRef, width, height } = useElementSize();

  let positionStyles = {};
  if (position) {
    positionStyles = {
      top: Math.min(position.top, window.innerHeight - height - pageGap),
      left: Math.min(position.top, window.innerWidth - width - pageGap)
    };
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: "0px",
        left: "0px",
        right: "0px",
        bottom: "0px",
        pointerEvents: "none"
      }}>
      <Box
        sx={{
          display: open ? "block" : "none",
          position: "absolute",
          pointerEvents: "auto",
          ...positionStyles,
          ...sx
        }}
        ref={sizeRef}
        {...props}>
        <Flex direction="column" sx={{ height: "100%" }}>
          <Flex justify="space-between" align="center">
            <Image
              src={Logo}
              fit="contain"
              height="20px"
              imageProps={{ style: { objectPosition: "left" } }}
            />
            <ActionIcon onClick={onClose}>
              <XIcon size="20px" />
            </ActionIcon>
          </Flex>
          {children}
        </Flex>
      </Box>
    </Box>
  );
};

export { OverlayCard };
