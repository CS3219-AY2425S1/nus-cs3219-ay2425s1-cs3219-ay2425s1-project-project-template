package routes

import (
	controller "backend/controllers"

	"github.com/gin-gonic/gin"
)

func ProfileRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.GET("/v1/profile", controller.GetUser)
}
