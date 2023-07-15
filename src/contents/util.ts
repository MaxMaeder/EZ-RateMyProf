const map = (
  number: number,
  fromLeft: number,
  fromRight: number,
  toLeft: number,
  toRight: number
): number => {
  return (
    toLeft + ((number - fromLeft) / (fromRight - fromLeft)) * (toRight - toLeft)
  );
};

const getRGColor = (value: number): string => {
  //value from 0 to 1
  var hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
};

export { map, getRGColor };
