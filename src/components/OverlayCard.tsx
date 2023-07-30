import {
  Box,
  type BoxProps,
  CloseButton,
  Flex,
  Image,
  Paper
} from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import Logo from "data-base64:~assets/Logo.svg";

type OverlayPosProps = {
  top: number;
  left: number;
};

interface OverlayCardProps extends BoxProps {
  open: boolean;
  onClose: () => void;
  position?: OverlayPosProps;
  pageGap?: number; // Min space between overlay and edge of page, pixels
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
      left: Math.min(position.left, window.innerWidth - width - pageGap)
    };
  }

  return (
    <div
      style={{
        visibility: open ? "visible" : "hidden",
        position: "fixed",
        inset: 0,
        pointerEvents: "none"
      }}>
      <Box
        sx={{
          position: "absolute",
          pointerEvents: "auto",
          ...positionStyles,
          ...sx
        }}
        ref={sizeRef}
        {...props}>
        <Paper p="sm" shadow="md">
          <Flex direction="column" sx={{ height: "100%" }}>
            <Flex justify="space-between" align="center" mb="sm">
              <Image
                src={Logo}
                fit="contain"
                height="18px"
                imageProps={{ style: { objectPosition: "left" } }}
                alt="EZ-RateMyProf Logo"
              />
              <CloseButton onClick={onClose} />
            </Flex>
            {children}
          </Flex>
        </Paper>
      </Box>
    </div>
  );
};

export { OverlayCard };
