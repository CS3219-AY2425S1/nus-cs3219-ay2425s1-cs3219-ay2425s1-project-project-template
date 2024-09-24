package controllers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func getQuestions(c echo.Context) (err error) {
	return c.String(http.StatusOK, "Get Questions!")
}
