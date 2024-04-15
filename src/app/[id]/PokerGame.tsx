import {
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
} from "../../ServerProvider/messages";
import { CopyToClipboard } from "../../CopyToClipboard";

type Props = {
  appState: AppState;
  sendMessage: (data: ClientAction) => void;
  myId: string;
};

export const PokerGame = ({ appState, sendMessage, myId }: Props) => {
  const iAmPlayer = appState.players[myId] !== undefined;
  const players = Object.entries(appState.players);

  return (
    <>
      <Stack direction="row" justifyContent={"space-around"}>
        <CopyToClipboard />
      </Stack>

      <Stack gap={1} alignItems={"center"}>
        <Sheet
          variant="soft"
          color="neutral"
          sx={{
            p: 1,
            borderRadius: 4,
          }}
        >
          <Typography>Spectators</Typography>
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
                    height: 64 + 32,
                    px: 2,
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
        </Sheet>
        <Stack sx={{ p: 1 }} gap={1}>
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
              py: 4,
              minWidth: 256,
            }}
          >
            <Typography level="h4">SparkPoker</Typography>
            Pick your cards
            {appState.votingInProgress ? (
              <Button
                onClick={() => {
                  sendMessage(createRevealVotesActionMessage());
                }}
              >
                Reveal Votes
              </Button>
            ) : (
              <Button
                onClick={() => {
                  sendMessage(createNewVotingActionMessage());
                }}
              >
                New Voting
              </Button>
            )}
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
              <Tooltip title={"Sit as player"}>
                <IconButton
                  variant="soft"
                  color="primary"
                  sx={{
                    minHeight: 64 + 32,
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
            )}
          </Stack>
        </Stack>
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
    </>
  );
};
