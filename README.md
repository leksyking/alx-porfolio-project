# alx-porfolio-project

Alx specialization portfolio project: An API for video chat and streaming

## Video Chat App using WebRTC and Golang

This project aims to build a video chat application using WebRTC technology on the frontend with React and Golang for the backend WebSocket server. It enables real-time video communication between users in a web browser environment.

## Features

- **Real-Time Video Communication:** Users can establish real-time video connections with others in the same room.
- **Simple Room Creation:** Rooms are dynamically created, allowing users to join unique chat sessions.
- **Efficient Signaling:** WebSocket server handles signaling for WebRTC connections efficiently.

## Technology Stack

- **Frontend:**

     - React.js
     - Vite.js for development server

- **Backend:**
     - Go programming language
     - [gorilla/websocket](https://github.com/gorilla/websocket) for WebSocket implementation

## Project Structure

- **Frontend:**

     - `src/app.jsx`: Main entry point for the React application.
     - `src/components/` directory: Contains React components for creating rooms and joining video chats.

- **Backend:**
     - `main.go`: Entry point for the Go backend. Initializes the WebSocket server and handles room creation and signaling.
     - `routes/routes.go`: Defines routes for handling room creation and joining.
     - `server/rooms.go`: Implements core server logic including room management and WebSocket handling.
     - `server/signalling.go`: Manages signaling between clients for establishing WebRTC connections.

## Getting Started

### Prerequisites

- Node.js and npm installed for frontend development.
- Go installed for backend development.

### Frontend Setup

1. Navigate to the `client-react` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.

### Backend Setup

1. Compile and build the Go backend:

      ```bash
      go build
      ```

2. Run the backend server:
      ```bash
      ./alx-portfolio-project
      ```

## Usage

1. Create a room by clicking the "Create Room" button.
2. Share the room ID with others to join the same room.
3. Users can join the room by entering the room ID and clicking the join button.

## Contributors

- [Ogundipe Felix](https://github.com/leksyking)

## License

This project is licensed under the [MIT License](LICENSE).
