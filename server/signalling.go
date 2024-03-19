package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateRoomRequestHandler create a room and return a roon ID
func CreateRoomRequestHandler(c *gin.Context) {
	c.JSON(http.StatusCreated, gin.H{"msg": "Room has  been created"})
}

// JoinRoomRequestHandler: join a room
func JoinRoomRequestHandler(c *gin.Context) {}