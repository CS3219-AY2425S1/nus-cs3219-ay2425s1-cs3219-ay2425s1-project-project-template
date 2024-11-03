package constants

const (
	JAVA       = "Java"
	PYTHON     = "Python"
	GOLANG     = "Golang"
	JAVASCRIPT = "Javascript"
	CPP        = "C++"
)

const (
	ACCEPTED  = "Accepted"
	ATTEMPTED = "Attempted"
)

var IS_VALID_LANGUAGE = map[string]bool{
	PYTHON: true,
	//JAVA:       true,
	//GOLANG:     true,
	//JAVASCRIPT: true,
	//CPP:        true,
}
