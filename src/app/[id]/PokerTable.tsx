import { Card, Stack, Typography } from "@mui/joy";
import { PlayerAvatar } from "./PlayerAvatar";
import { AppState } from "../../ServerProvider/messages";

type Props = {
  players: AppState["players"];
  myId: string;
  isRevealed: boolean;
};

export const PokerTable = ({ players, myId, isRevealed }: Props) => {
  return (
    <Stack sx={{ border: 1, p: 1 }} gap={1}>
      <Stack direction="row" gap={1} justifyContent={"space-evenly"}>
        {Object.entries(players).map(([id, user], i) =>
          i % 2 ? (
            <PlayerAvatar
              key={id}
              player={user}
              isActive={id === myId}
              isRevealed={isRevealed}
            />
          ) : null
        )}
      </Stack>
      <Card
        variant="soft"
        color="success"
        sx={{
          display: "flex",
          alignItems: "center",
          py: 8,
          minWidth: 256,
        }}
      >
        <Typography level="h4">SparkPoker</Typography>
        Pick your cards
      </Card>
      <Stack direction="row" gap={1} justifyContent={"space-evenly"}>
        {Object.entries(players).map(([id, user], i) =>
          i % 2 ? null : (
            <PlayerAvatar
              key={id}
              player={user}
              isActive={id === myId}
              isRevealed={isRevealed}
            />
          )
        )}
      </Stack>
    </Stack>
  );
};
