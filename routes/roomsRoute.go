package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/leksyking/alx-porfolio-project/server"
)

func RoomsRouter(route *gin.Engine) {
	roomRouter := route.Group("api/v1/room") 
	{
		roomRouter.GET("/create", server.CreateRoomRequestHandler)
		roomRouter.GET("/join", server.JoinRoomRequestHandler)
	}
}