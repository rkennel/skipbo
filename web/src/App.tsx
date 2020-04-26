import React, { useState } from "react";
import "./common.css";
import "./App.css";
import Login from "./Login";
import GameContainer from "./GameContainer";

import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {
  const [game, setGame] = useState({ id: "unknown" });
  const [player, setPlayer] = useState({ id: "unknown" });

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/game">
            <GameContainer/>
          </Route>
          <Route path="/">
            <Login setGame={setGame} setPlayer={setPlayer} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
