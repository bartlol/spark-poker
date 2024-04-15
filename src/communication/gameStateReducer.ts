import { AppState, ClientAction } from "./messages";

export function gameStateReducer(
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
