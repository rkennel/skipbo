import React, { useState } from "react";
import "./common.css";
import "./GameContainer.css";
import Chat from "./Chat";

function GameContainer() {

    return (
        <div className="GameContainer">
            <div id="game">Game</div>
            <Chat/>
        </div>
    );
}

export default GameContainer;
