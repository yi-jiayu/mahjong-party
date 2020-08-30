export interface Room {
  id: string;
  nonce: number;
  phase: number;
  players: Player[];
  round: Round;
  inside: boolean;
}

export interface Player {
  name: string;
}

export enum MeldType {
  Chi,
  Pong,
  Gang,
  Eyes,
}

export enum Phase {
  Draw = "draw",
  Discard = "discard",
  Finished = "finished",
}

export interface Meld {
  type: MeldType;
  tiles: string[];
}

export interface Hand {
  flowers: string[];
  revealed: Meld[];
  concealed: TileBag;
}

export type TileBag = Record<string, number>;

export enum ActionType {
  NextRound = "next",
  Draw = "draw",
  Discard = "discard",
  Chi = "chi",
  Pong = "pong",
  Gang = "gang",
  Hu = "hu",
  EndRound = "end",
}

export interface Action {
  nonce: number;
  type: ActionType;
  Tiles: string[];
}

export type ActionCallback = (type: ActionType, tiles?: string[]) => void;

export enum EventType {
  Start = "start",
  Draw = "draw",
  Discard = "discard",
  Chi = "chi",
  Pong = "pong",
  Gang = "gang",
  Hu = "hu",
  End = "end",
}

export interface Event {
  type: EventType;
  seat: number;
  time: string;
  tiles: string[];
}

export interface Round {
  draws_left: number;
  scores: number[];
  seat: number;
  hands: Hand[];
  events: Event[];
  dealer: number;
  wind: number;
  turn: number;
  phase: Phase;
  discards: string[];
  last_action_time: number;
  reserved_duration: number;
}
