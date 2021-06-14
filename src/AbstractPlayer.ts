import {Coord, Coords, ME, OPPONENT, PlayerNumber} from "@socialgorithm/ultimate-ttt/dist/model/constants";
import {GameResult, IPlayer} from "../types";
import UTTT from "@socialgorithm/ultimate-ttt";

export abstract class AbstractPlayer implements IPlayer {
    private opponent: number;
    public game: UTTT;

    public constructor(public player : PlayerNumber, public size : number) {
        if (!player || player < ME || player > OPPONENT) {
            throw new Error('Invalid player');
        }

        this.size = size;
        this.player = player;
        this.opponent = 1 - player;

        this.game = new UTTT(this.size);
    }

    /**
     * Initialises a new game
     */
    abstract init(): void;

    /**
     * Adds the move from your opponent to the board
     * @param coords Coords identifier {board: [row, col], move: [row, col]}
     */
    abstract addOpponentMove(coords: Coords): void;

    /**
     * Adds the move from your player to the board
     * @param coords Coords identifier {board: [row, col], move: [row, col]}
     */
    abstract addMove(coords: Coords): void;

    /**
     * Get the first move of the game
     * @returns Coords Position first move {board: [row, col], move: [row, col]}
     */
    abstract getMove(): Coords;

    /**
     * Your player has timed out
     */
    abstract timeout(): void;

    /**
     * Game has been finished
     * @param result Game result identifier (win | loss | tie)
     * @param move Position of opponents last move {board: [row, col], move: [row, col]}
     */
    abstract gameOver(result: GameResult, move?: Coords): void;

    /**
     * Match has been finished
     * @param result Game result identifier (win | loss | tie)
     * @param move Position of opponents last move {board: [row, col], move: [row, col]}
     */
    abstract matchOver(result: GameResult, move?: Coords): void;

}