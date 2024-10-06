package routes

import (
    "authentication-service/controllers"
    "github.com/gin-gonic/gin"
)

func InitialiseRoutes(r *gin.Engine) {
    r.POST("/api/v1/register", controllers.RegisterUser)
	r.POST("/api/v1/login", controllers.LoginUser)
    r.GET("/api/v1/jwt", controllers.TokenLogin)
}
