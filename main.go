package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/leksyking/alx-porfolio-project/routes"
	"github.com/leksyking/alx-porfolio-project/server"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("error loading environment variables")
	}
	server.AllRooms.Init()

	app := gin.New()
	app.Use(gin.Logger(), gin.Recovery())

	//routes
	routes.AuthRouter(app)
	routes.UserRouter(app)
	routes.RoomsRouter(app)
	app.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, "Welcome to Go Video chat and streaming")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	app.Run(":" + port)
}
