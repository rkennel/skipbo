import React, { useState } from "react";
import "./App.css";
import Login from "./Login";

import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {
  const [game, setGame] = useState({ id: "unknown" });
  const [player, setPlayer] = useState({ id: "unknown" });

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/game">
            <div>Let's Play a Game!</div>
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
