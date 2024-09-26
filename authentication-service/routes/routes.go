package routes

import (
    "authentication-service/controllers"
    "github.com/gin-gonic/gin"
)

func InitialiseRoutes(r *gin.Engine) {
    r.POST("/register", controllers.RegisterUser)
	r.POST("/login", controllers.LoginUser)
    r.GET("/jwt", controllers.TokenLogin)
}
