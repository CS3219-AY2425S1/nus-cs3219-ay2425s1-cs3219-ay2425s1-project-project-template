package controllers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetQuestions(c echo.Context) (err error) {
	return c.String(http.StatusOK, "Get Questions!")
}
