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

    const playerName = loginFormState.values.playerName;

    await createNewGame()
      .then(updateGame)
      .then((game) => addPlayerToGame(playerName, game))
      .then(updatePlayer);
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
