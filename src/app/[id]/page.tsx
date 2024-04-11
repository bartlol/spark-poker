import { useParams } from "react-router-dom";
import { PokerClient } from "./PokerClient";

export default function RoomPage() {
  const { roomId } = useParams();
  console.log("FOO", roomId);
  return <PokerClient serverId={roomId!} />;
}
