package routes

import (
    "account-creation-service/controllers"
    "github.com/gin-gonic/gin"
)

func InitialiseRoutes(r *gin.Engine) {
    r.POST("/register", controllers.RegisterUser)
	//r.POST("/login", controllers.LoginUser)
}
