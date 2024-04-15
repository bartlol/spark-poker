import { useCallback, useMemo } from "react";

const allowedValuesKey = "allowedValues";
const defaultAllowedValues = "1,2,4,8,16";

export const usePersistentAllowedValues = () => {
  const allowedValues =
    localStorage.getItem(allowedValuesKey) ?? defaultAllowedValues;

  const persistAllowedValues = useCallback(
    (values: string) => localStorage.setItem(allowedValuesKey, values),
    []
  );
  return useMemo(
    () => ({
      allowedValues,
      persistAllowedValues,
    }),
    [allowedValues, persistAllowedValues]
  );
};
