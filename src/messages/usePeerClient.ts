import Peer, { DataConnection } from "peerjs";
import { useEffect, useRef } from "react";

export type OnDataHandler = (data: unknown) => void;

export const useConnect = (id: string, handler: OnDataHandler) => {
  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);

  useEffect(() => {
    peerRef.current = new Peer();
    peerRef.current.on("open", (peerId: string) => {
      console.log("Peer client onOpen, peerId:", peerId);
      console.log("Trying to connect to", id);
      connectionRef.current = peerRef.current!.connect(id, { reliable: true });
      connectionRef.current.on("data", handler);
      connectionRef.current.on("error", (err) =>
        console.warn("error in connection", err)
      );
      console.log("Connected", connectionRef.current);
      //   connectionRef.current.on("open", () =>
      //     connectionRef.current?.send(createRequestStateActionMessage())
      //   );
    });
  }, [handler, id]);

  return connectionRef;
};
