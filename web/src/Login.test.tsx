import React from "react";
import { fireEvent, render, RenderResult, wait } from "@testing-library/react";
import Login, {
  LoginProps,
  PLAYER_NAME_INSTRUCTIONS,
  GAME_ID_INSTRUCTIONS,
} from "./Login";
import GameClient from "./wsclient/GameClient";
import PlayerClient from "./wsclient/GameClient";
import { Game, Player } from "skipbo-common";
import { act } from "react-dom/test-utils";

const NEW_GAME_ID = "NEW GAME ID";
const NEW_PLAYER_ID = "NEW PLAYER ID";

let newGameMock = function (): Promise<Game> {
  const game: Game = new Game();
  game.id = NEW_GAME_ID;
  return Promise.resolve(game);
};

function mockGameClient(): GameClient {
  return {
    newGame: newGameMock,
  };
}

jest.mock("./wsclient/GameClient", () => {
  return function () {
    return mockGameClient();
  };
});

let newPlayerMock = function (name: string, gameid: string): Promise<Player> {
  const player: Player = new Player(name);
  player.id = NEW_PLAYER_ID;
  player.gameid = gameid;
  return Promise.resolve(player);
};

function mockPlayerClient(): PlayerClient {
  return {
    newPlayer: newPlayerMock,
  };
}

jest.mock("./wsclient/PlayerClient", () => {
  return function () {
    return mockPlayerClient();
  };
});

describe("Login", () => {
  test("On Page Load", () => {
    //const login: RenderResult = render(<Login/>);

    let parent: RenderResult;
    act(() => {
      parent = render(createComponent(new LoginPropsTest(new Map())));
    });

    expect(getInputValue(parent.baseElement, "playerName")).toEqual(
      PLAYER_NAME_INSTRUCTIONS
    );
    expect(getInputValue(parent.baseElement, "gameId")).toEqual(
      GAME_ID_INSTRUCTIONS
    );
  });

  describe("On submit", () => {
    describe("Normal Scenario, new player and game", () => {
      let parent: RenderResult;
      let state: Map<string, Object>;

      const playerName = "bambino";

      beforeAll(async () => {
        state = new Map();

        act(() => {
          parent = render(createComponent(new LoginPropsTest(state)));

          setInputValue(parent.baseElement, "playerName", playerName);
        });

        await act(async () => {
          submitForm(parent.baseElement);
        });
      });

      beforeEach(() => {
        jest.clearAllMocks();
      });

      afterAll(() => {
        act(() => {
          parent.unmount();
        });
      });

      it("Creates a new game", async () => {
        await wait(() => {
          expect(getInputValue(parent.baseElement, "gameId")).toBe(NEW_GAME_ID);
        });
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

function setInputValue(
  loginElement: HTMLElement,
  attributeName: string,
  value: string
) {
  const input = getInput(loginElement, attributeName);
  fireEvent.change(input, { target: { value: value } });
}

function submitForm(loginElement: HTMLElement) {
  const button = loginElement.querySelector(`button[id="loginSubmit"]`) as HTMLElement;
  fireEvent.submit(button);
}

function createComponent(loginPropsTest: LoginPropsTest): React.Component {
  return (
    <Login
      setPlayer={loginPropsTest.setPlayer}
      setGame={loginPropsTest.setGame}
    />
  );
}

class LoginPropsTest extends LoginProps {
  constructor(map: Map<string, Object>) {
    super();
    this.setPlayer = function (player: Player) {
      map.set(Player.ENTITY_NAME, player);
    };

    this.setGame = function (game: Game) {
      map.set(Game.ENTITY_NAME, game);
    };
  }
}
