import React from 'react';
import {fireEvent, render, RenderResult, wait} from '@testing-library/react';
import Login, {LoginProps} from "./Login"
import GameClient from "./wsclient/GameClient";
import PlayerClient from "./wsclient/GameClient";
import {Game, Player} from "skipbo-common";

const NEW_GAME_ID = "NEW GAME ID";
const NEW_PLAYER_ID = "NEW PLAYER ID";

let newGameMock = function () {
    const game: Game = new Game();
    game.id = NEW_GAME_ID;
    return game;
};

function mockGameClient(): GameClient {
    return {
        newGame: newGameMock
    };
}

jest.mock("./wsclient/GameClient", () => {
    return function () {
        return mockGameClient();
    };
});

let newPlayerMock = function (name: string, gameid: string) {
    const player: Player = new Player(name);
    player.id = NEW_PLAYER_ID;
    player.gameid = gameid;
    return player;
}

function mockPlayerClient(): PlayerClient {
    return {
        newPlayer: newPlayerMock
    };
}

jest.mock("./wsclient/PlayerClient", () => {
    return function () {
        return mockPlayerClient();
    };
});


describe("Login", () => {

    test('On Page Load', () => {
        //const login: RenderResult = render(<Login/>);

        const parent: RenderResult = render(createParent(new LoginPropsTest(new Map())));
        expect(getInputValue(parent.baseElement, 'playerName')).toEqual("");
        expect(getInputValue(parent.baseElement, 'gameId')).toEqual("");
    });

    describe("On submit", () => {

        describe("Normal Scenario, new player and game", () => {
            let parent: RenderResult;
            let state: Map<string, Object>;

            const playerName = "bambino";

            beforeAll(async () => {
                state = new Map();
                parent = render(createParent(new LoginPropsTest(state)));

                setInputValue(parent.baseElement, "playerName", playerName);
                submitForm(parent.baseElement);
            });

            beforeEach(() => {
                jest.clearAllMocks();
            })

            afterAll(() => {
                parent.unmount();
            });


            it("Creates a new game", () => {
                expect(getInputValue(parent.baseElement, "gameId")).toBe(NEW_GAME_ID);
            });

            it("Saves game to state", async () => {
                await wait(() => {
                    const game: Game = state.get(Game.ENTITY_NAME) as Game;
                    expect(game.id).toEqual(NEW_GAME_ID);
                });
            });

            it("Saves new player to state", async () => {
                await wait(() => {
                    const player: Player = state.get(Player.ENTITY_NAME) as Player;
                    expect(player.name).toEqual(playerName);
                    expect(player.id).toEqual(NEW_PLAYER_ID);
                    expect(player.gameid).toEqual(NEW_GAME_ID);
                });
            });
        });

        if (false) {
            it("Adds a player to an existing game", () => {
                expect(1 + 1).toEqual(3);
            });

            it("If player already exists, then it displays appropriate error message", () => {
                expect(1 + 1).toEqual(3);
            });

            it("If game id does not exist then it displays appropriate error message", () => {
                expect(1 + 1).toEqual(3);
            });

            it("If game has exceeded number of players then it displays appropriate error message", () => {
                expect(1 + 1).toEqual(3);
            });

            it("If game has already started then it displays appropriate error message", () => {
                expect(1 + 1).toEqual(3);
            });
        }

    });


});

function getInput(loginElement: HTMLElement, name: string): HTMLElement {
    return loginElement.querySelector(`input[name="${name}"]`) as HTMLElement;
}

function getInputValue(loginElement: HTMLElement, attributeName: string) {
    return getInput(loginElement, attributeName).getAttribute("value");
}

function setInputValue(loginElement: HTMLElement, attributeName: string, value: string) {
    const input = getInput(loginElement, attributeName);
    fireEvent.change(input, {target: {value: value}})
}

function submitForm(loginElement: HTMLElement) {
    const button = getInput(loginElement, "loginSubmit");
    fireEvent.submit(button);
}

function createParent(loginPropsTest: LoginPropsTest) {
    return (
        <div>
            I am the parent of the login component
            <Login setPlayer={loginPropsTest.setPlayer} setGame={loginPropsTest.setGame}/>
        </div>
    );
}

class LoginPropsTest extends LoginProps {

    constructor(map: Map<string, Object>) {
        super();

        this.setPlayer = function (player: Player) {
            map.set(Player.ENTITY_NAME, player);
        }

        this.setGame = function (game: Game) {
            map.set(Game.ENTITY_NAME, game);
        }
    }


}