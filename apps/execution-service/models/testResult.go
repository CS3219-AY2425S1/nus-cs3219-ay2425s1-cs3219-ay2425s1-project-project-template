package models

type TestResults struct {
	VisibleTestResults []IndividualTestResult `json:"visibleTestResults"`
	HiddenTestResults  GeneralTestResults     `json:"hiddenTestResults"`
	CustomTestResults  []IndividualTestResult `json:"customTestResults"`
}

type IndividualTestResult struct {
	Input    string `json:"input"`
	Expected string `json:"expected"`
	Actual   string `json:"actual"`
	Passed   bool   `json:"passed"`
	Error    string `json:"error,omitempty"`
}

type GeneralTestResults struct {
	Passed int `json:"passed"`
	Total  int `json:"total"`
}
