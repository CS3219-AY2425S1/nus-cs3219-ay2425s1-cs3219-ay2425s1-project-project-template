package main

//this is the main class to run the server

import (
	"github.com/gin-gonic/gin"
	//"net/http"
)

// for initial API testing
var questions = []Question{
	{
		ID:         1,
		Difficulty: Medium,
		Title: "Two Sum",
		Description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
		TestCases: map[string]string{
			"[2, 7, 11, 15], 9": "[0, 1]",
			"[3, 2, 4], 6": "[1, 2]",
			"[3, 3], 6": "[0, 1]",
		},
	},
	{
		ID:         2,
		Difficulty: Easy,
		Title: "Reverse Integer",
		Description: "Given a 32-bit signed integer, reverse digits of an integer.",
		TestCases: map[string]string{
			"123": "321",
			"1": "1",
			"22": "22",
		},
	},
	{
		ID:         3,
		Difficulty: Hard,
		Title: "Median of Two Sorted Arrays",
		Description: "There are two sorted arrays nums1 and nums2 of size m and n respectively. Find the median of the two sorted arrays.",
		TestCases: map[string]string{
			"[1, 3], [2]": "2.0",
			"[1, 2], [3, 4]": "2.5",
			"[0, 0], [0, 0]": "0.0",
		},
	},
}

func main() {
	router := gin.Default()
	router.GET("/questions", GetAllQuestions)
	router.Run(":9090")
}