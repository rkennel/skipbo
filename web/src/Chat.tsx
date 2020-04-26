import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./common.css";
import "./Chat.css";

function Chat() {
  // useEffect(() => {
  //   const socket = io.connect("http://localhost:8080");
  //   socket.on("event", (data: any) => {
  //     console.log(data);
  //   });
  // }, []);

  return (
    <div className="Chat">
      <div className="title">Live Stream</div>
      <div className="stream">Stream of Text</div>
      <div className="enterText">
        <form>
          <input type="text" className="chatInput" />
        </form>
      </div>
    </div>
  );
}

export default Chat;
