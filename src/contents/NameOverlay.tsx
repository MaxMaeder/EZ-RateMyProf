import { Box, Paper, Text } from "@mantine/core";
import type { PlasmoCSUIProps, PlasmoGetOverlayAnchor } from "plasmo";
import type { PlasmoWatchOverlayAnchor } from "plasmo";
import { type FC, useCallback, useEffect, useState } from "react";

const NameOverlay: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const [id, setId] = useState("");
  const [location, setLocation] = useState([0, 0]);
  const [hoveredInline, setHoveredInline] = useState(null);
  console.log(anchor);

  /*const updateOverlay = useCallback(
    (event: MouseEvent) => {
      console.log("hover");
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.classList.contains("rate-inline")) return;

      if (hoveredInline) hoveredInline.classList.remove("hover");
      target.classList.add("hover");
      setHoveredInline(target);

      let professorId: string = target.dataset.id;
      setId(professorId);

      var rect = target.getBoundingClientRect();
      //console.log(rect.top, rect.right, rect.bottom, rect.left);

      setLocation([(rect.left + rect.right) / 2, rect.top]);
      console.log(professorId);
    },
    [hoveredInline]
  );

  useEffect(() => {
    const body = document.body;
    body.addEventListener("mouseover", updateOverlay);

    return () => body.removeEventListener("mouseover", updateOverlay);
  });*/

  /*return (
    <Box sx={{ position: "relative" }}>
      <Paper
        sx={{
          height: "200px",
          width: "300px",
          position: "absolute"
        }}
        style={{ top: location[0], left: location[1] }}>
        hi {id} x: {location[0]} y: {location[1]}
      </Paper>
    </Box>
  );*/
  return (
    <Paper
      sx={{
        height: "200px",
        width: "300px"
      }}>
      hi {id} x: {location[0]} y: {location[1]}
    </Paper>
  );
};

export default NameOverlay;

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.querySelector(".hover") || document.body;

let hoveredInline = null;
document.body.addEventListener("mouseover", (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.classList.contains("rate-inline")) return;

  console.log("hover");
  //if (hoveredInline) hoveredInline.classList.remove("hover");

  for (let element of document.querySelectorAll(".hover")) {
    element.classList.remove("hover");
  }

  target.classList.add("hover");
  hoveredInline = target;

  let professorId: string = target.dataset.id;
  //setId(professorId);

  var rect = target.getBoundingClientRect();
  //console.log(rect.top, rect.right, rect.bottom, rect.left);

  //setLocation([(rect.left + rect.right) / 2, rect.top]);
  console.log(professorId);
});
