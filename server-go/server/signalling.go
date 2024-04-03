package server

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var AllRooms RoomMap
var upgrader websocket.Upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type broadcastMsg struct {
	Message map[string]interface{}
	RoomID string
	Client *websocket.Conn
}
var broadcast = make(chan broadcastMsg)

// Read message
func handleWebSocketConnection(ws *websocket.Conn, roomID string) {
	for {
		var msg broadcastMsg
		err := ws.ReadJSON(&msg.Message)
		if err != nil {
			log.Fatalf("error reading from websocket connection: %v", err)
			ws.Close()
			break
		}
		msg.Client = ws
		msg.RoomID = roomID
		log.Println(msg.Message)
		broadcast <- msg
	}
}

// CreateRoomRequestHandler create a room and return a roon ID
func CreateRoomRequestHandler(c *gin.Context) {
	roomID := AllRooms.CreateRoom()
	c.JSON(http.StatusCreated, gin.H{"msg": "Room has  been created", "room_id": roomID})
}

// JoinRoomRequestHandler: join a room
func JoinRoomRequestHandler(c *gin.Context) {
	roomID := c.Query("roomID")
	if roomID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "roomID is missing in the URL"})
		return
	}

	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "websocket upgrade error!"})
		return
	}

	AllRooms.InsertIntoRoom(roomID, false, ws)

	// handleWebSocketConnection(ws, roomID)
    go handleWebSocketConnection(ws, roomID)
}


func HandleBroadcast() {
	for {
		msg := <- broadcast
		for _, client := range AllRooms.Map[msg.RoomID]{
			if client.Conn != msg.Client {
				err := client.Conn.WriteJSON(msg.Message)
				if err != nil {
					log.Fatalf("error writing to ws connection: %v", err)
					client.Conn.Close()
				}
			}
		}
	}
}