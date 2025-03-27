import './App.css';
import Login from './components/login';
import SignUp from './components/signup';
import React, { useState } from "react";
import { Chat } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import Cookies from "universal-cookie";
import JoinGame from "./components/JoinGame";
import Game from "./components/Game";

function App() {
  const api_key = "3hr7p76vu6km";
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);
  const [inGame, setInGame] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("username");
    client.disconnectUser();
    setIsAuth(false);
  };

  if (token) {
    client.connectUser(
        {
          id: cookies.get("userId"),
          name: cookies.get("username"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword"),
        },
        token
      )
      .then((user) => {
        setIsAuth(true);
      });
  }

  return (
    <div className="App">
      {isAuth ? (
        <Chat client={client}>
          {inGame ? (
            <Game channel={client.channel} setChannel={setInGame} handleLogout={logOut} />
          ) : (
            <JoinGame setInGame={setInGame} />
          )}
          {!inGame && (
            <button onClick={logOut}> Log Out</button>
          )}
        </Chat>
      ) : (
        <>
          <SignUp setIsAuth={setIsAuth} />
          <Login setIsAuth={setIsAuth} />
        </>
      )}
    </div>
  );
}

export default App;
