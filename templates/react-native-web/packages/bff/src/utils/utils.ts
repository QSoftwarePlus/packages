export const nativeEnumToArray = <T extends object>(obj: T): Array<keyof T> =>
  Object.keys(obj) as Array<keyof T>

export const calculateAgeFromDate = (birthDate: any) => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let ageDiff = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    ageDiff--;
  }

  return ageDiff;
};
