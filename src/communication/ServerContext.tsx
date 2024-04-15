import Peer, { DataConnection } from "peerjs";
import { ReactNode, createContext } from "react";
import {
  AppState,
  clientActionSchema,
  createClientDisconnectedActionMessage,
} from "./messages";
import { gameStateReducer } from "./gameStateReducer";

let peerClient: Peer | null = null;
let serverState: AppState = {
  spectators: {},
  players: {},
  allowedVotes: [1, 2],
  votingInProgress: true,
};
let connections: DataConnection[] = [];

function setNewState(state: AppState) {
  serverState = state;
  connections.forEach((connection) => {
    const message = serverState;
    connection.send(message);
    console.log("Sent: ", JSON.stringify(message));
  });
}

const runServer = (id: string, allowedValues: number[]) => {
  serverState.allowedVotes = allowedValues;
  if (peerClient !== null) {
    return;
  }
  peerClient = new Peer(id);
  peerClient.on("open", () => console.log("PeerClient onOpen event"));

  peerClient.on("error", (err) => console.log("PeerClient onError event", err));

  console.log("Created client:", peerClient);
  peerClient.on("connection", (newConnection) => {
    console.log("NEW CONNECTION HANDLING!");
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
    console.log("NEW CONNECTION HANDLING DONE!!!!!");
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
