"use client";

import { Button, Stack } from "@mui/joy";
import {
  AppState,
  ClientAction,
  createClearVoteClientActionMessage,
  createVoteClientActionMessage,
} from "../../ServerProvider/messages";

type Props = {
  appState: AppState;
  sendMessage: (data: ClientAction) => void;
  myId: string;
};

export const PlayingCards = ({ appState, sendMessage, myId }: Props) => {
  const myVote = appState.players[myId].currentVote;
  return (
    <Stack
      direction="row"
      gap={1}
      sx={{
        py: 2,
      }}
    >
      {appState.allowedVotes.map((value) => (
        <Button
          key={value}
          variant={myVote === value ? "solid" : "outlined"}
          onClick={() => {
            const message =
              myVote === value
                ? createClearVoteClientActionMessage()
                : createVoteClientActionMessage(value);
            sendMessage(message);
          }}
          sx={{
            width: "3rem",
            py: 4,
            transition: "transform 0.2s ease 0s",
            ":hover": {
              transform: "translateY(-8px)",
            },
          }}
        >
          {value}
        </Button>
      ))}
    </Stack>
  );
};
