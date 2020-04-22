import GameClient from "./GameClient";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Game, Player } from "skipbo-common";
import { WebServiceError } from "../errors/WebServiceError";
import PlayerClient from "./PlayerClient";

describe("Creating new player", () => {
  let playerClient: PlayerClient;

  beforeAll(() => {
    playerClient = new PlayerClient();
    playerClient.client = jest.mock("axios");
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Normal circumstances, successful request", async () => {
    const player: Player = JSON.parse(createNewPlayerJsonResponse) as Player;

    playerClient.client.post = function (
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Game>> {
      const axiosResponse: AxiosResponse = createAxiosResponse<Player>(
        player,
        201,
        "Created"
      );
      return Promise.resolve(axiosResponse);
    };

    const clientPostSpy = jest.spyOn(playerClient.client, "post");

    const actual: Player = await playerClient.newPlayer(
      player.name,
      player.gameid
    );

    expect(actual.id).toEqual("jestplay");
    expect(clientPostSpy).toBeCalledWith("http://localhost:8080/player", {
      name: player.name,
      gameid: player.gameid,
    });
  });

  it("Catches any axios error and wraps it up", async () => {
    const axiosError: AxiosError = createAxiosError(400, "Bad Request");

    playerClient.client.post = function (
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Game>> {
      return Promise.reject(axiosError);
    };

    try {
      await playerClient.newPlayer();
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

const createNewPlayerJsonResponse = `{
    "name": "sammy",
    "gameid": "jestgame",
    "id": "jestplay"
}`;
