import { Button, Card, Typography } from "@mui/joy";
import { useCallback, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { ServerContext } from "../ServerProvider/ServerContext";
import { useNavigate } from "react-router-dom";

export const HostComponent = () => {
  const runServer = useContext(ServerContext);
  const navigate = useNavigate();

  const createNewRoom = useCallback(() => {
    const roomId = uuidv4();
    console.log("Creating room with id", roomId);
    runServer!(roomId);
    navigate(roomId);
  }, [runServer, navigate]);

  return (
    <Card>
      <Typography level="h1">Welcome to SparkPoker</Typography>
      <Button onClick={createNewRoom}>Create new room</Button>
    </Card>
  );
};
