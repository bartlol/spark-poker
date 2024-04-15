import { Card, Stack, Typography } from "@mui/joy";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { AppState } from "../../ServerProvider/messages";
type Props = {
  user: AppState["spectators"][number];
  isActive: boolean;
};
export const SpectatorAvatar = ({ user, isActive }: Props) => {
  return (
    <Card variant="soft" color={isActive ? "warning" : "warning"}>
      <Stack
        alignItems={"center"}
        justifyContent={"space-evenly"}
        height="100%"
      >
        <RemoveRedEyeIcon />
        <Typography>{user.name}</Typography>
      </Stack>
    </Card>
  );
};
