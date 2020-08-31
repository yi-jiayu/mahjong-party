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

// noinspection NonAsciiCharacters
const sequences: Record<string, string[][]> = {
  "13一筒": [["14二筒", "15三筒"]],
  "14二筒": [
    ["13一筒", "15三筒"],
    ["15三筒", "16四筒"],
  ],
  "15三筒": [
    ["13一筒", "14二筒"],
    ["14二筒", "16四筒"],
    ["16四筒", "17五筒"],
  ],
  "16四筒": [
    ["14二筒", "15三筒"],
    ["15三筒", "17五筒"],
    ["17五筒", "18六筒"],
  ],
  "17五筒": [
    ["15三筒", "16四筒"],
    ["16四筒", "18六筒"],
    ["18六筒", "19七筒"],
  ],
  "18六筒": [
    ["16四筒", "17五筒"],
    ["17五筒", "19七筒"],
    ["19七筒", "20八筒"],
  ],
  "19七筒": [
    ["17五筒", "18六筒"],
    ["18六筒", "20八筒"],
    ["20八筒", "21九筒"],
  ],
  "20八筒": [
    ["18六筒", "19七筒"],
    ["19七筒", "21九筒"],
  ],
  "21九筒": [["19七筒", "20八筒"]],
  "22一索": [["23二索", "24三索"]],
  "23二索": [
    ["22一索", "24三索"],
    ["24三索", "25四索"],
  ],
  "24三索": [
    ["22一索", "23二索"],
    ["23二索", "25四索"],
    ["25四索", "26五索"],
  ],
  "25四索": [
    ["23二索", "24三索"],
    ["24三索", "26五索"],
    ["26五索", "27六索"],
  ],
  "26五索": [
    ["24三索", "25四索"],
    ["25四索", "27六索"],
    ["27六索", "28七索"],
  ],
  "27六索": [
    ["25四索", "26五索"],
    ["26五索", "28七索"],
    ["28七索", "29八索"],
  ],
  "28七索": [
    ["26五索", "27六索"],
    ["27六索", "29八索"],
    ["29八索", "30九索"],
  ],
  "29八索": [
    ["27六索", "28七索"],
    ["28七索", "30九索"],
  ],
  "30九索": [["28七索", "29八索"]],
  "31一万": [["32二万", "33三万"]],
  "32二万": [
    ["31一万", "33三万"],
    ["33三万", "34四万"],
  ],
  "33三万": [
    ["31一万", "32二万"],
    ["32二万", "34四万"],
    ["34四万", "35五万"],
  ],
  "34四万": [
    ["32二万", "33三万"],
    ["33三万", "35五万"],
    ["35五万", "36六万"],
  ],
  "35五万": [
    ["33三万", "34四万"],
    ["34四万", "36六万"],
    ["36六万", "37七万"],
  ],
  "36六万": [
    ["34四万", "35五万"],
    ["35五万", "37七万"],
    ["37七万", "38八万"],
  ],
  "37七万": [
    ["35五万", "36六万"],
    ["36六万", "38八万"],
    ["38八万", "39九万"],
  ],
  "38八万": [
    ["36六万", "37七万"],
    ["37七万", "39九万"],
  ],
  "39九万": [["37七万", "38八万"]],
};

export { sequences };
