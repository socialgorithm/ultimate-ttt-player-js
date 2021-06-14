import {Coord, Coords, ME, OPPONENT, PlayerNumber} from "@socialgorithm/ultimate-ttt/dist/model/constants";

export enum ServerMessage {
    INIT = "init",
    MOVE = "move",
    OPPONENT = "opponent",
    TIMEOUT = "timeout",
    GAME = "game",
    MATCH = "match",
}

export enum GameResult {
    WIN = "win",
    LOSS = "loss",
    TIE = "tie"
}

export interface IPlayer {
    init: () => void;
    addOpponentMove: (coords: Coords) => void;
    addMove: (coords: Coords) => void;
    getMove: () => Coords;
    timeout: () => void;
    gameOver: (result: GameResult, move?: Coords) => void;
    matchOver: (result: GameResult, move?: Coords) => void;
}
