import React, {useState} from 'react';
import './App.css';
import Login from "./Login";

function App() {

  const [game,setGame] = useState({id:"unknown"});
  const [player,setPlayer] = useState({id:"unknown"});

  return (
    <div className="App">
      <Login setGame={setGame} setPlayer={setPlayer}/>
      {JSON.stringify(game)}<br/>
      {JSON.stringify(player)}
    </div>
  );
}

export default App;
