package utils

import (
	"execution-service/enums"
	"execution-service/execution/python"
	"execution-service/models"
	"fmt"
)

func ExecuteTest(code models.Code, test models.Test) (models.TestResults, error) {
	var err error
	var testResults models.TestResults

	switch code.Language {
	case enums.PYTHON:
		testResults, err = getTestResultFromTest(code, test, python.RunPythonCode)
		break
	default:
		return models.TestResults{}, fmt.Errorf("unsupported language: %s", code.Language)
	}
	if err != nil {
		return models.TestResults{}, err
	}

	return testResults, nil
}

//func getVisibleTestResultsWithCompilationError(test models.Test,
//	testCaseErrorStr string) ([]models.IndividualTestResult, error) {
//	_, visibleTestResults, err := GetTestLengthAndUnexecutedCases(test.VisibleTestCases)
//	if err != nil {
//		return nil, err
//	}
//
//	for _, visibleTestResult := range visibleTestResults {
//		visibleTestResult.Actual = ""
//		visibleTestResult.Passed = false
//		visibleTestResult.Error = testCaseErrorStr
//	}
//
//	return visibleTestResults, nil
//}
//
//func getHiddenTestResultsWithCompilationError(test models.Test) (models.GeneralTestResults, error) {
//	numHiddenTests, err := GetTestLength(test.HiddenTestCases)
//	if err != nil {
//		return models.GeneralTestResults{}, err
//	}
//
//	return models.GeneralTestResults{
//		Passed: 0,
//		Total:  numHiddenTests,
//	}, nil
//}

func getIndividualTestResultFromCodeExecutor(code string, unexecutedTestResult models.IndividualTestResult,
	executor func(string, string) (string, string, error)) (models.IndividualTestResult, error) {
	output, outputErr, err := executor(code, unexecutedTestResult.Input)
	if err != nil {
		return models.IndividualTestResult{}, err
	}
	return models.IndividualTestResult{
		Input:    unexecutedTestResult.Input,
		Expected: unexecutedTestResult.Expected,
		Actual:   output,
		Passed:   output == unexecutedTestResult.Expected,
		Error:    outputErr,
	}, nil
}

func getAllTestResultsFromFormattedTestCase(code string, testCase string,
	executor func(string, string) (string, string, error)) ([]models.IndividualTestResult, error) {
	_, testResults, err := GetTestLengthAndUnexecutedCases(testCase)
	if err != nil {
		return nil, err
	}

	for i := range testResults {
		currTestResult, err := getIndividualTestResultFromCodeExecutor(code, testResults[i], executor)
		if err != nil {
			return nil, err
		}
		testResults[i].Actual = currTestResult.Actual
		testResults[i].Passed = currTestResult.Passed
		testResults[i].Error = currTestResult.Error
	}

	return testResults, nil
}

func getGenericTestResultsFromFormattedTestCase(code string, testCase string,
	executor func(string, string) (string, string, error)) (models.GeneralTestResults, error) {
	testResults, err := getAllTestResultsFromFormattedTestCase(code, testCase, executor)
	if err != nil {
		return models.GeneralTestResults{}, err
	}

	var passed int
	for _, testResult := range testResults {
		if testResult.Passed {
			passed++
		}
	}

	return models.GeneralTestResults{
		Passed: passed,
		Total:  len(testResults),
	}, nil
}

func getTestResultFromTest(code models.Code, test models.Test,
	executor func(string, string) (string, string, error)) (models.TestResults, error) {
	visibleTestResults, err := getAllTestResultsFromFormattedTestCase(code.Code, test.VisibleTestCases, executor)
	if err != nil {
		return models.TestResults{}, err
	}

	hiddenTestResults, err := getGenericTestResultsFromFormattedTestCase(code.Code, test.HiddenTestCases, executor)
	if err != nil {
		return models.TestResults{}, err
	}

	var customTestResults []models.IndividualTestResult
	if code.CustomTestCases != "" {
		customTestResults, err = getAllTestResultsFromFormattedTestCase(code.Code, code.CustomTestCases, executor)
		if err != nil {
			return models.TestResults{}, err
		}
	}

	return models.TestResults{
		VisibleTestResults: visibleTestResults,
		HiddenTestResults:  hiddenTestResults,
		CustomTestResults:  customTestResults,
	}, nil
}

//func getVisibleTestResults(code string, test models.Test) ([]models.IndividualTestResult, error) {
//	_, visibleTestResults, err := GetTestLengthAndUnexecutedCases(test.VisibleTestCases)
//	if err != nil {
//		return nil, err
//	}
//
//	// Initialize Yaegi interpreter
//	i := interp.New(interp.Options{})
//	i.Use(stdlib.Symbols)
//
//	_, err = i.Eval(code)
//	if err != nil {
//		return nil, fmt.Errorf("error evaluating code: %v", err)
//	}
//
//	// Execute each test case
//	for _, visibleTestResult := range visibleTestResults {
//		// Create an output buffer to capture stdout
//		var stdout bytes.Buffer
//		i.Stdout = &stdout
//
//		// Set up the input for the test case
//		input := strings.NewReader(visibleTestResult.Input + "\n")
//		i.Stdin = input
//
//		// Run the code
//		_, err := i.Eval("main.main()")
//		if err != nil {
//			visibleTestResult.Actual = ""
//			visibleTestResult.Passed = false
//			visibleTestResult.Error = err.Error()
//			continue
//		}
//
//		actualOutput := strings.TrimSpace(stdout.String())
//
//		visibleTestResult.Actual = actualOutput
//		visibleTestResult.Passed = actualOutput == visibleTestResult.Expected
//	}
//
//	return visibleTestResults, nil
//}
