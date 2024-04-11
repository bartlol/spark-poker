import Peer, { DataConnection } from "peerjs";
import { ReactNode, createContext } from "react";
import {
  AppState,
  ClientAction,
  clientActionSchema,
  createClientDisconnectedActionMessage,
} from "./messages";

let peerClient: Peer | null = null;
let serverState: AppState = {
  spectators: {},
  players: {},
  allowedVotes: ["1", "2", "666"],
  votingInProgress: true,
};
let connections: DataConnection[] = [];

function stateReducer(
  state: AppState,
  action: ClientAction,
  connectionId: string
): AppState {
  switch (action.type) {
    case "vote":
      return {
        ...state,
        players: {
          ...state.players,
          [connectionId]: {
            name: state.players[connectionId].name,
            currentVote: action.payload.voteValue,
          },
        },
      };
    case "enterGame":
      switch (action.payload.role) {
        case "player":
          return {
            ...state,
            players: {
              ...state.players,
              [connectionId]: {
                name: action.payload.name,
                currentVote: null,
              },
            },
          };
        case "spectator":
          return {
            ...state,
            spectators: {
              ...state.spectators,
              [connectionId]: {
                name: action.payload.name,
              },
            },
          };
        default:
          throw new Error(`Hit unknown role: ${action.payload.role}`);
      }

    case "clientDisconnected":
      const newState = { ...state };
      if (newState.players[connectionId] !== undefined) {
        delete newState.players[connectionId];
      } else {
        delete newState.spectators[connectionId];
      }
      return newState;
    case "reveal":
      return {
        ...state,
        votingInProgress: false,
      };
    case "newVoting": {
      const newUsers = Object.fromEntries(
        Object.entries(state.players).map(([connectionId, user]) => [
          connectionId,
          { currentVote: null, name: user.name },
        ])
      );
      return {
        ...state,
        votingInProgress: true,
        players: newUsers,
      };
    }
    case "clearVote":
      return {
        ...state,
        players: {
          ...state.players,
          [connectionId]: {
            name: state.players[connectionId].name,
            currentVote: null,
          },
        },
      };
    case "requestState":
      return state;
    case "changeRole":
      switch (action.payload.role) {
        case "player": {
          const newState = {
            ...state,
            players: {
              ...state.players,
              [connectionId]: {
                name: state.spectators[connectionId].name,
                currentVote: null,
              },
            },
          };
          delete newState.spectators[connectionId];
          return newState;
        }
        case "spectator": {
          const newState = {
            ...state,
            spectators: {
              ...state.spectators,
              [connectionId]: {
                name: state.players[connectionId].name,
              },
            },
          };
          delete newState.players[connectionId];
          return newState;
        }
        default:
          throw new Error(`Hit unknown role: ${action.payload.role}`);
      }
    default:
      throw new Error(`Hit default in stateReducer ${action}`);
  }
}

function setNewState(state: AppState) {
  serverState = state;
  connections.forEach((connection) => {
    const message = serverState;
    connection.send(message);
    console.log("Sent: ", JSON.stringify(message));
  });
}

const runServer = (id: string) => {
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
        stateReducer(
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
        stateReducer(
          serverState,
          createClientDisconnectedActionMessage(),
          connectionId
        )
      );
    });
    newConnection.on("data", (data) => {
      const action = clientActionSchema.parse(data);
      const newState = stateReducer(serverState, action, connectionId);
      setNewState(newState);
    });
    console.log("runServer", connections, connections.length);
    console.log("NEW CONNECTION HANDLING DONE!!!!!");
  });
};

export const ServerContext = createContext<((id: string) => void) | null>(null);

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
