import { Button, Stack } from "@mui/joy";
import { AppState } from "../../ServerProvider/messages";

type Props = {
  appState: AppState;
};

export const SpectatorPlayingCards = ({ appState }: Props) => {
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
          disabled
          key={value}
          variant={"outlined"}
          sx={{
            width: "3rem",
            py: 4,
          }}
        >
          {value}
        </Button>
      ))}
    </Stack>
  );
};
