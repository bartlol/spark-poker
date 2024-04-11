import { Button, Card, Stack, Typography } from "@mui/joy";
import { useCallback, useState } from "react";
import { PokerGame } from "./PokerGame";
import {
  AppState,
  appStateSchema,
  createEnterGameActionMessage,
} from "../../ServerProvider/messages";
import { OnDataHandler, useConnect } from "../../messages/usePeerClient";

type Props = {
  serverId: string;
};

export const PokerClient = ({ serverId }: Props) => {
  const [appState, setAppState] = useState<AppState | null>(null);
  const onDataHandler: OnDataHandler = useCallback((data) => {
    console.log("Client received", data);
    const newState = appStateSchema.parse(data);
    setAppState(newState);
  }, []);

  const [chosenName, setChosenName] = useState<string>("");
  const [typedInName, setTypedInName] = useState<string>("");
  const connection = useConnect(serverId, onDataHandler);
  const connected = connection.current !== null;
  const nameChosen = chosenName !== "";

  if (connected && nameChosen && appState) {
    return (
      <PokerGame
        appState={appState!}
        myId={connection.current!.label}
        sendMessage={(data) => connection.current?.send(data)}
      />
    );
  }

  return (
    <Stack alignContent={"center"}>
      <Card>
        <Typography>Choose your name</Typography>
        <input onChange={(e) => setTypedInName(e.target.value)} />
        <Button
          onClick={() => {
            connection.current?.send(
              createEnterGameActionMessage(typedInName, "player")
            );
            setChosenName(typedInName);
          }}
          loading={!connected && nameChosen}
        >
          Join as Player
        </Button>
        <Button
          onClick={() => {
            connection.current?.send(
              createEnterGameActionMessage(typedInName, "spectator")
            );
            setChosenName(typedInName);
          }}
          loading={!connected && nameChosen}
          variant="soft"
        >
          Join as Spectator
        </Button>
      </Card>
    </Stack>
  );
};
