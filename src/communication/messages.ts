import { z } from "zod";

const allowedVoteSchema = z.number();
const userRoleSchema = z.union([z.literal("player"), z.literal("spectator")]);
const spectatorSchema = z.object({
  name: z.string(),
});

export type UserRole = z.infer<typeof userRoleSchema>;

const playerSchema = z.object({
  name: z.string(),
  currentVote: allowedVoteSchema.nullable(),
});

const voteClientAction = z.object({
  type: z.literal("vote"),
  payload: z.object({
    voteValue: allowedVoteSchema,
  }),
});

const clearVoteAction = z.object({
  type: z.literal("clearVote"),
});

const revealVotesClientAction = z.object({
  type: z.literal("reveal"),
});

const newVotingClientAction = z.object({
  type: z.literal("newVoting"),
});

const enterGameClientAction = z.object({
  type: z.literal("enterGame"),
  payload: z.object({
    name: z.string(),
    role: userRoleSchema,
  }),
});

const clientDisconectedAction = z.object({
  type: z.literal("clientDisconnected"),
});

const requestStateAction = z.object({
  type: z.literal("requestState"),
});

const changeRoleAction = z.object({
  type: z.literal("changeRole"),
  payload: z.object({
    role: userRoleSchema,
  }),
});

export const clientActionSchema = z.discriminatedUnion("type", [
  voteClientAction,
  revealVotesClientAction,
  newVotingClientAction,
  enterGameClientAction,
  clientDisconectedAction,
  clearVoteAction,
  requestStateAction,
  changeRoleAction,
]);

export type ClientAction = z.infer<typeof clientActionSchema>;
export function createVoteClientActionMessage(voteValue: number): ClientAction {
  return {
    type: "vote",
    payload: {
      voteValue,
    },
  };
}

export function createClearVoteClientActionMessage(): ClientAction {
  return {
    type: "clearVote",
  };
}

export function createEnterGameActionMessage(
  playerName: string,
  role: z.infer<typeof userRoleSchema>
): ClientAction {
  return {
    type: "enterGame",
    payload: {
      name: playerName,
      role,
    },
  };
}
export function createChangeRoleActionMessage(
  role: z.infer<typeof userRoleSchema>
): ClientAction {
  return {
    type: "changeRole",
    payload: {
      role,
    },
  };
}
export function createClientDisconnectedActionMessage(): ClientAction {
  return {
    type: "clientDisconnected",
  };
}
export function createRevealVotesActionMessage(): ClientAction {
  return {
    type: "reveal",
  };
}

export function createNewVotingActionMessage(): ClientAction {
  return {
    type: "newVoting",
  };
}

export function createRequestStateActionMessage(): ClientAction {
  return {
    type: "requestState",
  };
}

export const appStateSchema = z.object({
  spectators: z.record(z.string(), spectatorSchema),
  players: z.record(z.string(), playerSchema),
  allowedVotes: z.array(allowedVoteSchema),
  votingInProgress: z.boolean(),
});

export type AppState = z.infer<typeof appStateSchema>;

export type Spectator = z.infer<typeof spectatorSchema>;
export type Player = z.infer<typeof playerSchema>;
