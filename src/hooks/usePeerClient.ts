import Peer, { DataConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";

export type OnDataHandler = (data: unknown) => void;
export type OnErrorHandler = (err: unknown) => void;
export type OnCloseHandler = () => void;
export type OnOpenHandler = () => void;

export const useConnect = (
  id: string,
  onDataHandler: OnDataHandler,
  onErrorHandler: OnErrorHandler,
  onCloseHandler: OnCloseHandler,
  onOpenHandler: OnOpenHandler
) => {
  const peerRef = useRef<Peer | null>(null);
  const [connection, setConnection] = useState<DataConnection | null>(null);

  useEffect(() => {
    if (peerRef.current === null) {
      peerRef.current = new Peer();
      peerRef.current.on("open", () => {
        const newConnection = peerRef.current!.connect(id, { reliable: true });
        setConnection(newConnection);
      });
      return () => {
        peerRef.current?.off("open");
        setConnection(null);
      };
    } else {
      peerRef.current.on("open", () => {
        const newConnection = peerRef.current!.connect(id, { reliable: true });
        setConnection(newConnection);
      });
      return () => {
        peerRef.current?.off("open");
        setConnection(null);
      };
    }
  }, [id]);

  useEffect(() => {
    connection?.on("data", onDataHandler);
    return () => void connection?.off("data");
  }, [onDataHandler, connection]);

  useEffect(() => {
    connection?.on("error", onErrorHandler);
    return () => void connection?.off("error");
  }, [onErrorHandler, connection]);

  useEffect(() => {
    connection?.on("close", onCloseHandler);
    return () => void connection?.off("close");
  }, [onCloseHandler, connection]);

  useEffect(() => {
    connection?.on("open", onOpenHandler);
    return () => void connection?.off("open");
  }, [onOpenHandler, connection]);

  useEffect(() => {
    if (connection !== null) {
      return () => {
        connection.close();
        setConnection(null);
      };
    }
  }, [connection]);

  // const peerRef = useRef<Peer | null>(null);
  // const connectionRef = useRef<DataConnection | null>(null);
  // const navigate = useNavigate();
  // useEffect(() => {
  //   peerRef.current = new Peer();
  //   peerRef.current.on("open", (peerId: string) => {
  //     console.log("Peer client onOpen, peerId:", peerId);
  //     console.log("Trying to connect to", id);
  //     connectionRef.current = peerRef.current!.connect(id, { reliable: true });
  //     connectionRef.current.on("data", onDataHandler);
  //     connectionRef.current.on("close", () => {
  //       navigate("/disconnected");
  //     });
  //     connectionRef.current.on("error", (err) =>
  //       console.warn("error in connection", err)
  //     );
  //     console.log("Connected", connectionRef.current);
  //   });
  // }, [onDataHandler, id, navigate]);

  return connection;
};
