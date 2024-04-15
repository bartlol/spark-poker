import {
  Box,
  Button,
  Card,
  IconButton,
  Sheet,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { PlayingCards } from "./PlayingCards";
import { SpectatorPlayingCards } from "./SpectatorPlayingCards";
import AddIcon from "@mui/icons-material/Add";
import { SpectatorAvatar } from "./SpectatorAvatar";
import { DummyPlayerAvatar, PlayerAvatar } from "./PlayerAvatar";
import {
  AppState,
  ClientAction,
  createNewVotingActionMessage,
  createRevealVotesActionMessage,
  createChangeRoleActionMessage,
} from "../../communication/messages";
import { CopyToClipboard } from "./CopyToClipboard";
import { useCallback } from "react";

type Props = {
  appState: AppState;
  sendMessage: (data: ClientAction) => void;
  myId: string;
};

export const PokerGame = ({ appState, sendMessage, myId }: Props) => {
  const iAmPlayer = appState.players[myId] !== undefined;
  const players = Object.entries(appState.players);
  const allVoted =
    players.filter((player) => player[1].currentVote !== null).length ===
    players.length;

  const handleRevealVoting = useCallback(
    () => sendMessage(createRevealVotesActionMessage()),
    [sendMessage]
  );
  const handleNewVoting = useCallback(
    () => sendMessage(createNewVotingActionMessage()),
    [sendMessage]
  );

  return (
    <Stack gap={1} alignItems={"center"} flex={1} py={1}>
      <Stack gap={2}>
        <CopyToClipboard />
        <Sheet
          variant="soft"
          color="warning"
          sx={{
            p: 1,
            mb: 1,
            borderRadius: 8,
            minWidth: 256,
          }}
        >
          <Stack alignItems={"center"} gap={1}>
            <Typography level="h4">Spectators</Typography>
            <Stack direction="row" gap={1} justifyContent={"space-evenly"}>
              {Object.entries(appState.spectators).map(([id, spectator]) => (
                <SpectatorAvatar
                  key={id}
                  user={spectator}
                  isActive={id === myId}
                />
              ))}
              {iAmPlayer && (
                <Tooltip title={"Sit as spectator"}>
                  <IconButton
                    variant="soft"
                    color="warning"
                    sx={{
                      height: 80,
                      px: 2,
                      borderRadius: 100,
                    }}
                    onClick={() => {
                      sendMessage(createChangeRoleActionMessage("spectator"));
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>
        </Sheet>
      </Stack>
      <Stack gap={3}>
        <Stack direction="row" gap={1} justifyContent={"space-evenly"}>
          {players.length < 2 ? (
            <DummyPlayerAvatar />
          ) : (
            players.map(([id, user], i) =>
              i % 2 ? (
                <PlayerAvatar
                  key={id}
                  player={user}
                  isActive={id === myId}
                  isRevealed={!appState.votingInProgress}
                />
              ) : null
            )
          )}
        </Stack>
        <Card
          variant="soft"
          color="success"
          sx={{
            display: "flex",
            alignItems: "center",
            py: 2,
            minWidth: 256 + 64,
          }}
        >
          <Typography level="h4">SparkPoker</Typography>
          <Typography level="body-lg">
            {appState.votingInProgress ? "Pick your cards" : "Start new voting"}
          </Typography>
          <Button
            variant={allVoted ? "solid" : "soft"}
            sx={{
              transition: "transform 0.2s ease 0s",
              transform: allVoted ? "scale(1.15)" : "scale(1)",
            }}
            onClick={
              appState.votingInProgress ? handleRevealVoting : handleNewVoting
            }
          >
            {appState.votingInProgress ? "Reveal Votes" : "New Voting"}
          </Button>
        </Card>

        <Stack direction="row" gap={1} justifyContent={"space-evenly"}>
          {players.map(([id, user], i) =>
            i % 2 ? null : (
              <PlayerAvatar
                key={id}
                player={user}
                isActive={id === myId}
                isRevealed={!appState.votingInProgress}
              />
            )
          )}
          {!iAmPlayer && (
            <Box>
              <Tooltip title={"Sit as player"}>
                <IconButton
                  variant="soft"
                  color="primary"
                  sx={{
                    height: 96,
                    px: 2,
                    borderRadius: 100,
                  }}
                  onClick={() => {
                    sendMessage(createChangeRoleActionMessage("player"));
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Box sx={{ height: 128 - 96, visibility: "hidden" }} />
            </Box>
          )}
        </Stack>
      </Stack>
      <Stack flex={1} justifyContent={"end"}>
        {iAmPlayer ? (
          <PlayingCards
            appState={appState}
            myId={myId}
            sendMessage={sendMessage}
          />
        ) : (
          <SpectatorPlayingCards appState={appState} />
        )}
      </Stack>
    </Stack>
  );
};
