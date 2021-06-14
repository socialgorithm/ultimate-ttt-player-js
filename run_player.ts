import {Interface} from "readline";
import {GameResult, ServerMessage} from "./types";
import {AbstractPlayer} from "./src/AbstractPlayer";
import {Coords, ME} from "@socialgorithm/ultimate-ttt/dist/model/constants";
import {RandomPlayer} from "./src/random/RandomPlayer";

const readline = require('readline');
const player : AbstractPlayer = new RandomPlayer(ME, 3);

const writeMove = (coords: Coords) => {
  const move = 'send:' + coords.board[0] + ',' + coords.board[1] + ';' +
      coords.move[0] + ',' + coords.move[1];
  write(move);
}

const write = (output: string) => {
  if (output) {
    console.log(output);
  }
}

const processCoords = (move : string) : Coords => {
  // the move will be in the format x,y;x,y
  // where the first pair are the board's coordinates
  // and the second one are the move's coordinates

  const next : string[] = move.split(';');
  const boardCoords : number[] = next[0].split(',').map((coord) => parseInt(coord, 10));
  const moveCoords : number[] = next[1].split(',').map((coord) => parseInt(coord, 10));
  return {
    board: [
      boardCoords[0],
      boardCoords[1]
    ],
    move: [
      moveCoords[0],
      moveCoords[1]
    ]
  };
}


const processResult = (result: string) : GameResult => {
  switch (result) {
    case GameResult.WIN : return GameResult.WIN;
    case GameResult.LOSS : return GameResult.LOSS;
    case GameResult.TIE : return GameResult.TIE;
  }
  throw new Error("Game/Match Result Was Not One Of (win/loss/tie)");
}

const processInit = player.init;

const processMove = () => {
  try {
    const coords : Coords = player.getMove();
    player.addMove(coords);
    writeMove(coords);
  } catch(e) {
    console.error('Player1.ts Error: Failed to get a move', e);
  }
};

const processOpponentMove = (move : Coords) => {
  try {
    player.addOpponentMove(move);
    if (!player.game.isFinished()) {
      const coords = player.getMove();
      player.addMove(coords);
      writeMove(coords);
    }
  } catch(e) {
    console.error('Player1.ts Error: Failed to get a move', e);
  }
};

const processTimeout = player.timeout;

const processGameOver = (result : GameResult, lastMove ?: Coords) => {
  if (lastMove) player.addOpponentMove(lastMove);
  player.gameOver(result, lastMove);
}

const processMatchOver = (result : GameResult, lastMove ?: Coords) => {
  if (lastMove) player.addOpponentMove(lastMove);
  player.matchOver(result, lastMove);
}

const lineProcessor = (line : string) : void => {
  const parts : string[] = line.split(' ');
  const action : ServerMessage = parts[0] as ServerMessage;

  switch (action) {
    case ServerMessage.INIT:
      return processInit();
    case ServerMessage.MOVE:
      return processMove();
    case ServerMessage.OPPONENT:
      const opponentsMove = processCoords(parts[1]);
      return processOpponentMove(opponentsMove);
    case ServerMessage.TIMEOUT:
      return processTimeout();
    case ServerMessage.GAME:
      const gameResult = processResult(parts[1]);
      const lastGameMove = parts[2] ? processCoords(parts[2]) : undefined;
      return processGameOver(gameResult, lastGameMove);
    case ServerMessage.MATCH:
      const matchResult = processResult(parts[1]);
      const lastMatchMove = parts[2] ? processCoords(parts[2]) : undefined;
      return processMatchOver(matchResult, lastMatchMove);
  }
}

const readLineInterface : Interface = readline.createInterface(
    {
      input: process.stdin,
      output: process.stdout
    }
);

readLineInterface.on('line', lineProcessor);
