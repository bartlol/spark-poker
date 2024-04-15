import { Link, Sheet, Stack, Typography } from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";
export const DisconnectedPage = () => {
  return (
    <Stack flex={1} justifyContent={"space-around"}>
      <Sheet
        variant="outlined"
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          borderRadius: 8,
        }}
      >
        <Typography level="h2">Disconnected</Typography>
        <Typography level="body-md">Room has been closed</Typography>
        <Link component={RouterLink} to="/">
          Go back to main page
        </Link>
      </Sheet>
    </Stack>
  );
};
