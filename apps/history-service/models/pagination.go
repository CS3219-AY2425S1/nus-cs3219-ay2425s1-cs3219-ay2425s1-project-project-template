package models

type HistoriesResponse struct {
	TotalCount  int                    `json:"totalCount"`
	TotalPages  int                    `json:"totalPages"`
	CurrentPage int                    `json:"currentPage"`
	Limit       int                    `json:"limit"`
	HasNextPage bool                   `json:"hasNextPage"`
	Questions   []CollaborationHistory `json:"histories"`
}
