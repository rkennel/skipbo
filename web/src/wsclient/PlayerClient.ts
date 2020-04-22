import { Player } from "skipbo-common";
import axios, { AxiosInstance } from "axios";
import { WebServiceError } from "../errors/WebServiceError";

export default class PlayerClient {
  client: AxiosInstance = axios;

  newPlayer(name: string, gameid: string): Promise<Player> {
    const input = {
      name: name,
      gameid: gameid,
    };

    return this.client
      .post("http://localhost:8080/player",input)
      .then((axiosResponse) => {
        return Promise.resolve(axiosResponse.data);
      })
      .catch((axiosError) => {
        return Promise.reject(new WebServiceError(axiosError));
      });
  }
}
