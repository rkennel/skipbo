import { Game } from "skipbo-common";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { WebServiceError } from "../errors/WebServiceError";

export default class GameClient {
  client: AxiosInstance = axios;

  newGame(): Promise<Game> {
    return this.client
      .post("http://localhost:8080/game")
      .then((axiosResponse) => {
        return Promise.resolve(axiosResponse.data);
      })
      .catch((axiosError) => {
        return Promise.reject(new WebServiceError(axiosError));
      });
  }
}
