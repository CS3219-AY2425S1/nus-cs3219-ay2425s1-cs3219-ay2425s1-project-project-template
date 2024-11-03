package handler

import (
	"net/http"
	"strings"

	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"github.com/runabol/tork"
	"github.com/runabol/tork/engine"
	"github.com/runabol/tork/input"
	"github.com/runabol/tork/middleware/web"
)

type ExecRequest struct {
	Language string `json:"language"`
	Code     string `json:"code"`
}

func Handler(c web.Context) error {
	er := ExecRequest{}

	if err := c.Bind(&er); err != nil {
		c.Error(http.StatusBadRequest, errors.Wrapf(err, "error binding request"))
		return nil
	}

	log.Debug().Msgf("%s", er.Code)

	task, err := buildTask(er)
	if err != nil {
		c.Error(http.StatusBadRequest, err)
		return nil
	}

	result := make(chan string)

	listener := func(j *tork.Job) {
		if j.State == tork.JobStateCompleted {
			result <- j.Execution[0].Result
		} else {
			result <- j.Execution[0].Error
		}
	}

	input := &input.Job{
		Name:  "code execution",
		Tasks: []input.Task{task},
	}

	job, err := engine.SubmitJob(c.Request().Context(), input, listener)

	if err != nil {
		c.Error(http.StatusBadRequest, errors.Wrapf(err, "error executing code"))
		return nil
	}

	log.Debug().Msgf("job %s submitted", job.ID)

	select {
	case r := <-result:
		log.Debug().Msgf("output: %s", r)
		if r == "error reading the std out: context deadline exceeded" {
			r = "Execution Timeout: The code execution took too long and was terminated."
		}
		return c.JSON(http.StatusOK, map[string]string{"output": r})
	case <-c.Done():
		return c.JSON(http.StatusGatewayTimeout, map[string]string{"message": "timeout"})
	}
}

func buildTask(er ExecRequest) (input.Task, error) {
	var image string
	var run string
	var filename string
	switch strings.TrimSpace(er.Language) {
	case "":
		return input.Task{}, errors.Errorf("require: language")
    case "python":
        image = "python:3.10.0"
        filename = "script.py"
        run = "python script.py > $TORK_OUTPUT"
    case "javascript":
        image = "node:18.15.0"
        filename = "script.js"
        run = "node script.js > $TORK_OUTPUT"
    case "java":
        image = "openjdk:15.0.2"
        filename = "Main.java"
        run = "javac Main.java && java Main > $TORK_OUTPUT"
    case "php":
        image = "php:8.2.3"
        filename = "script.php"
        run = "php script.php > $TORK_OUTPUT"
    case "cpp":
        image = "gcc:10.2.0"
        filename = "program.cpp"
        run = "g++ program.cpp -o program && ./program > $TORK_OUTPUT"
    case "R":
        image = "r-base:4.1.0"
        filename = "script.R"
        run = "Rscript script.R > $TORK_OUTPUT"
	default:
		return input.Task{}, errors.Errorf("unknown language: %s", er.Language)
	}

	return input.Task{
		Name:    "execute code",
		Image:   image,
		Run:     run,
		Timeout: "30s",
		Limits: &input.Limits{
			CPUs:   "1",
			Memory: "50m",
		},
		Files: map[string]string{
			filename: er.Code,
		},
	}, nil
}