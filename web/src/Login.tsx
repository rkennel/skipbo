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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const gameClient: GameClient = new GameClient();
    const newGame: Game = gameClient.newGame();

    const playerName = loginFormState.values.playerName;
    const playerClient: PlayerClient = new PlayerClient();
    const newPlayer: Player = playerClient.newPlayer(playerName, newGame.id);

    loginFormState.setField("gameId", newGame.id);

    props.setGame(newGame);
    props.setPlayer(newPlayer);

    event.preventDefault();
  }

  function debugValues() {
    console.log(loginFormState.values);
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <div className="label">Name:</div>
        <div className="input">
          <input {...text("playerName")} />
        </div>
        <div className="label">Game ID:</div>
        <div className="input">
          <input {...text("gameId")} />
        </div>
        <div>
          <input type="submit" name="loginSubmit" value="Submit" />
        </div>
      </form>
    </div>
  );
}

export default Login;
