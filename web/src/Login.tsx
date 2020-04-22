import "./common.css";
import "./Login.css";

import React, { FormEvent } from "react";
import { useFormState } from "react-use-form-state";
import { Game, Player } from "skipbo-common";
import GameClient from "./wsclient/GameClient";
import PlayerClient from "./wsclient/PlayerClient";

export class LoginProps {
  setPlayer: (player: Player) => void = (player: Player) => {
    //do nothing}
  };

  setGame: (game: Game) => void = (game: Game) => {
    console.log("doing nothing");
    //do nothing}
  };
}

function Login<T extends LoginProps>(props: T) {
  interface LoginFormFields {
    playerName: string;
    gameId: string;
  }

  const [loginFormState, { text }] = useFormState<LoginFormFields>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    function createNewGame(): Promise<Game> {
      const gameClient: GameClient = new GameClient();
      return gameClient.newGame();
    }

    function updateGame(game: Game): Promise<Game> {
      loginFormState.setField("gameId", game.id);
      props.setGame(game);
      return Promise.resolve(game);
    }

    function addPlayerToGame(playerName: string, game: Game): Promise<Player> {
      const playerClient: PlayerClient = new PlayerClient();
      return playerClient.newPlayer(playerName, game.id);
    }

    function updatePlayer(player: Player): Promise<Player> {
      props.setPlayer(player);
      return Promise.resolve(player);
    }

    event.preventDefault();

    const playerName = loginFormState.values.playerName;
    try {
      await createNewGame()
        .then(updateGame)
        .then((game) => addPlayerToGame(playerName, game))
        .then(updatePlayer);
    } catch (e) {
      console.log(e.message);
      console.log(e);
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <div className="logo">
          SB
        </div>
        <div className="inputPrompt">
          Enter a player name and game id
        </div>
        <div className="input">
          <input {...text("playerName")} className="notInputted"/>
        </div>
        <div className="input">
          <input {...text("gameId")} className="notInputted"/>
        </div>
        <div className="inputButton">
          <button className="login" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
