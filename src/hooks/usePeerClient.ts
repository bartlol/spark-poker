import Peer, { DataConnection } from "peerjs";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export type OnDataHandler = (data: unknown) => void;

export const useConnect = (id: string, handler: OnDataHandler) => {
  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    peerRef.current = new Peer();
    peerRef.current.on("open", (peerId: string) => {
      console.log("Peer client onOpen, peerId:", peerId);
      console.log("Trying to connect to", id);
      connectionRef.current = peerRef.current!.connect(id, { reliable: true });
      connectionRef.current.on("data", handler);
      connectionRef.current.on("close", () => {
        navigate("/disconnected");
      });
      connectionRef.current.on("error", (err) =>
        console.warn("error in connection", err)
      );
      console.log("Connected", connectionRef.current);
    });
  }, [handler, id, navigate]);

  return connectionRef;
};
