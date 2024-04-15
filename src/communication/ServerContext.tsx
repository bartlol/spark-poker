import Peer, { DataConnection } from "peerjs";
import { ReactNode, createContext } from "react";
import {
  AppState,
  clientActionSchema,
  createClientDisconnectedActionMessage,
} from "./messages";
import { gameStateReducer } from "./gameStateReducer";

function getInitialState(): AppState {
  return {
    spectators: {},
    players: {},
    allowedVotes: [],
    votingInProgress: true,
  };
}

let peerClient: Peer | null = null;
let serverState: AppState = getInitialState();
let connections: DataConnection[] = [];

function setNewState(state: AppState) {
  serverState = state;
  connections.forEach((connection) => {
    const message = serverState;
    connection.send(message);
  });
}

function resetServer() {
  connections.forEach((connection) => connection.close());
  connections = [];
  peerClient?.disconnect();
  peerClient?.destroy();
  peerClient = null;
  serverState = getInitialState();
}

const runServer = (id: string, allowedValues: number[]) => {
  resetServer();
  peerClient = new Peer(id);

  serverState.allowedVotes = allowedValues;
  peerClient.on("open", () => console.log("Server onOpen event"));
  peerClient.on("error", (err) => console.log("Server onError event", err));
  console.log("Created server:", peerClient);
  peerClient.on("connection", (newConnection) => {
    console.log("Server onConnection event", newConnection);
    const connectionId = newConnection.label;
    connections.push(newConnection);
    newConnection.on("close", () => {
      const ind = connections.findIndex(
        (conn) => conn.label === newConnection.label
      );
      connections.splice(ind, 1);
      setNewState(
        gameStateReducer(
          serverState,
          createClientDisconnectedActionMessage(),
          connectionId
        )
      );
    });
    newConnection.on("error", () => {
      const ind = connections.findIndex(
        (conn) => conn.label === newConnection.label
      );
      connections.splice(ind, 1);
      setNewState(
        gameStateReducer(
          serverState,
          createClientDisconnectedActionMessage(),
          connectionId
        )
      );
    });
    newConnection.on("data", (data) => {
      const action = clientActionSchema.parse(data);
      const newState = gameStateReducer(serverState, action, connectionId);
      setNewState(newState);
    });
    console.log("runServer", connections, connections.length);
    console.log("Server on connection finished");
  });
};

export const ServerContext = createContext<
  ((id: string, values: number[]) => void) | null
>(null);

type Props = {
  children: ReactNode;
};

export const ServerContextProvider = ({ children }: Props) => {
  return (
    <ServerContext.Provider value={runServer}>
      {children}
    </ServerContext.Provider>
  );
};
