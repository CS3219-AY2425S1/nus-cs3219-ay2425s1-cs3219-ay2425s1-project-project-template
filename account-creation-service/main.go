package main

import (
    "log"
    "os"

    "account-creation-service/controllers"
    "account-creation-service/services"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func main() {
    err := godotenv.Load(".env.dev")
    if err != nil {
        log.Fatalf("Error loading .env.dev file")
    }

    defer services.DisconnectDB()
    
    r := gin.Default()
    r.POST("/register", controllers.RegisterUser)
    port := os.Getenv("PORT")
    if port == "" {
        port = "4040"
    }
    r.Run(":" + port)
}
