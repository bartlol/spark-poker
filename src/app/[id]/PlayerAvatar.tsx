import { Box, Sheet, Stack, Typography } from "@mui/joy";
import { AppState } from "../../ServerProvider/messages";

type Props = {
  player: AppState["players"][number];
  isActive: boolean;
  isRevealed: boolean;
};
export const PlayerAvatar = ({ player, isActive, isRevealed }: Props) => {
  return (
    <Stack alignItems={"center"} sx={{ gap: 1 }}>
      <Sheet
        variant="soft"
        color={isActive ? "primary" : "neutral"}
        sx={{
          height: 64 + 32,
          width: "3.5rem",
          p: 2,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          gap: 2,
        }}
      >
        <Typography level={isRevealed ? "h3" : "h1"}>
          {isRevealed
            ? player.currentVote ?? "-"
            : player.currentVote !== null
            ? "🎁"
            : "🤔"}
        </Typography>
      </Sheet>
      <Typography level="title-lg">{player.name}</Typography>
    </Stack>
  );
};

export const DummyPlayerAvatar = () => {
  return <Box sx={{ visibility: "hidden", height: 128 }} />;
};
