import { Sheet, Typography } from "@mui/joy";
import { AppState } from "../../ServerProvider/messages";

type Props = {
  player: AppState["players"][number];
  isActive: boolean;
  isRevealed: boolean;
};
export const PlayerAvatar = ({ player, isActive, isRevealed }: Props) => {
  return (
    <Sheet
      variant="soft"
      color={isActive ? "primary" : "neutral"}
      sx={{
        maxHeight: 64 + 32,
        p: 2,
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* <PersonIcon /> */}

      <Typography level="title-lg">{player.name}</Typography>
      <Typography level="h1">
        {isRevealed
          ? player.currentVote ?? "-"
          : player.currentVote !== null
          ? "🎁"
          : "🤔"}
      </Typography>
    </Sheet>
  );
};
