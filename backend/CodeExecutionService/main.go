package main

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"

	"code-execution-service/handler"
	"github.com/runabol/tork/cli"
	"github.com/runabol/tork/conf"
	"github.com/runabol/tork/engine"
)

func main() {
	if err := conf.LoadConfig(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
    images := []string{
        "python:3.10.0",
        "node:18.15.0",
        "openjdk:15.0.2",
        "php:8.2.3",
    }

    // Pull the Docker images
    for _, image := range images {
        fmt.Printf("Pulling Docker image: %s\n", image)
        cmd := exec.Command("docker", "pull", image)
        cmd.Stdout = os.Stdout
        cmd.Stderr = os.Stderr
        if err := cmd.Run(); err != nil {
            fmt.Printf("Error pulling Docker image %s: %v\n", image, err)
            os.Exit(1)
        }
    }
	engine.RegisterEndpoint(http.MethodPost, "/execute", handler.Handler)

	if err := cli.New().Run(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}