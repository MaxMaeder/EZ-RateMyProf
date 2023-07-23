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

export { map };
