package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/leksyking/alx-porfolio-project/controllers"
	"github.com/leksyking/alx-porfolio-project/middlewares"
)

func UserRouter(route *gin.Engine) {
	userRoute := route.Group("/api/v1/user", middlewares.Authentication)
	{
		userRoute.GET("/show", controllers.ShowUser)
	}
}
