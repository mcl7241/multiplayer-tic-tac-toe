# multiplayer-tic-tac-toe
multiplayer tic tac toe with auth and live stream chat

Authentication System
The project began with implementing an authentication system using cookies and the bcrypt package. Users can sign up by submitting their details (e.g., username, first name, last name, and hashed password). These details are securely stored in cookies and retrieved upon login, ensuring privacy. Logging out clears the cookies for security. The stream package was also utilized to enhance security and manage user sessions.

Multiplayer Connection
To enable two players on different computers to play together, I used the Stream Chat React SDK to create a real-time connection. I developed a joinGame React component that tracks a rival player’s username and sets up a dedicated chat channel for API interactions. This channel enables real-time updates by querying the opponent's username and matching them for gameplay. This component also ensures each match has a chat channel with real-time message exchange.

Game Logic and Board
The game board logic was implemented in Node.js and React, with state management and rendering for the Tic Tac Toe board. I created an array of nine empty strings to represent the board squares and used React's useEffect hook to monitor game state changes, such as wins or ties. I added functions like checkWin and checkTie, adhering to standard game rules and alerting users when a result is reached. A chooseSquare function handles game logic by restricting user turns and updating the opponent's board with moves in real time. The board also features CSS styling for a polished and user-friendly interface.

Real-Time Chat Integration
A real-time chat feature was integrated into the game to enhance communication between players. Using Stream Chat components like the window and message list, I added options to react to or hide messages, ensuring a clean interface. Rendering logic was included to display notifications for wins, ties, and game status. Asynchronous event handlers were implemented to manage channel closures when a player leaves the game.

Front-End and Bug Fixes
CSS enhancements improved the styling of the chat and the entire game board, making it more visually appealing and interactive. I also styled the welcome page for a polished look. Several bugs were resolved, including issues with awaiting channels when one player hadn’t joined the game yet. Features like disabling file attachments to streamline the experience.
