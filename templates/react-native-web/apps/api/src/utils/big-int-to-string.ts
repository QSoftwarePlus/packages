export const bigIntToString = (value: any) => {
  const int = Number.parseInt(value);
  return int ?? value;
};
