import GameClient from "./GameClient";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Game } from "skipbo-common";
import { WebServiceError } from "../errors/WebServiceError";

describe("Creating new game", () => {
  let gameClient: GameClient;

  beforeAll(() => {
    gameClient = new GameClient();
    gameClient.client = jest.mock("axios");
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Normal circumstances, successful request", async () => {
    gameClient.client.post = function (
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Game>> {
      const game: Game = JSON.parse(createNewGameJsonResponse) as Game;
      const axiosResponse: AxiosResponse = createAxiosResponse<Game>(
        game,
        201,
        "Created"
      );
      return Promise.resolve(axiosResponse);
    };

    const actual: Game = await gameClient.newGame();

    expect(actual.id).toEqual("jestgame");
  });

  it("Catches any axios error and wraps it up", async () => {
    const axiosError: AxiosError = createAxiosError(400, "Bad Request");
    gameClient.client.post = function (
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Game>> {
      return Promise.reject(axiosError);
    };

    try {
      const actual: Game = await gameClient.newGame();
    } catch (err) {
      const webServiceError: WebServiceError = err as WebServiceError;
      expect(webServiceError.status).toEqual(400);
      expect(webServiceError.statusText).toEqual("Bad Request");
      expect(webServiceError.axiosError).toEqual(axiosError);
    }
  });
});

function createAxiosResponse<T>(
  data: T,
  status: number,
  statusText: string
): AxiosResponse {
  return {
    data: data,
    status: status,
    statusText: statusText,
    headers: [],
    config: {},
  };
}

function createAxiosError(status: number, statusText: string): AxiosError {
  const response: AxiosResponse = createAxiosResponse(
    undefined,
    status,
    statusText
  );

  return {
    config: {},
    response: response,
    message: "message",
    name: "name",
    toJSON: function () {
      return {};
    },
    isAxiosError: true,
  };
}

const createNewGameJsonResponse = `{
    "players": [],
    "spectators": [],
    "buildingPiles": [
        [],
        [],
        [],
        []
    ],
    "entityName": "game",
    "id": "jestgame"
}`;
