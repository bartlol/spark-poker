import { useCallback, useMemo } from "react";

const playerNameKey = "playerName";
const defaultPlayerName = "";

export const usePersistentPlayerName = () => {
  const playerName = localStorage.getItem(playerNameKey) ?? defaultPlayerName;
  const persistPlayerName = useCallback(
    (value: string) => localStorage.setItem(playerNameKey, value),
    []
  );
  return useMemo(
    () => ({
      playerName,
      persistPlayerName,
    }),
    [playerName, persistPlayerName]
  );
};
