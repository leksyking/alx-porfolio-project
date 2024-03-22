package server

import (
	"context"
	"net/http"
	"time"

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
func broadcaster() {
	for {
		msg := <- broadcast
		for _, client := range AllRooms.Map[msg.RoomID]{
			if client.Conn != msg.Client {
				err := client.Conn.WriteJSON(msg.Message)
				if err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Error sending message to the room!"})
					client.Conn.Close()
				}
			}
		}
	}
}
// CreateRoomRequestHandler create a room and return a roon ID
func CreateRoomRequestHandler(c *gin.Context) {
	roomID := AllRooms.CreateRoom()
	c.JSON(http.StatusCreated, gin.H{"msg": "Room has  been created", "roomID": roomID})
}

// JoinRoomRequestHandler: join a room
func JoinRoomRequestHandler(c *gin.Context) {
	var _, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	roomID := c.Query("roomID")
	if roomID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "roomID is missing in the URL"})
		return
	}

	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "websocket upgrade error!"})
		return
	}

	AllRooms.InsertIntoRoom(roomID, false, ws)
	go broadcaster()
	for {
		var msg broadcastMsg
		err := ws.ReadJSON(&msg.Message)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "E"})
		}
		msg.Client = ws
		msg.RoomID = roomID
	}
	c.JSON(http.StatusOK, gin.H{"msg": "You have joined the room"})
}
