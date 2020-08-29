export enum MeldType {
  Chi,
  Pong,
  Gang,
  Eyes,
}

export enum Phase {
  Draw,
  Discard,
  Finished,
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

export interface Round {
  seat: number;
  scores: number[];
}

export type TileBag = Record<string, number>;

export enum EventType {
  Draw = "draw",
  Discard = "discard",
  Chi = "chi",
  Pong = "pong",
  Gang = "gang",
}

export interface Event {
  type: EventType;
  seat: number;
  time: string;
  tiles: string[];
}

export interface Round {
  hands: Hand[];
  events: Event[];
  turn: number;
  phase: Phase;
}
