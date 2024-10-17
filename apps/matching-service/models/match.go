package models

type MatchRequest struct {
	Type         string   `json:"type"`
	Topics       []string `json:"topics"`
	Difficulties []string `json:"difficulties"`
}

type MatchFound struct {
	Type        string `json:"type"`
	MatchID     int64  `json:"matchId"`
	PartnerID   int64  `json:"partnerId"`
	PartnerName string `json:"partnerName"`
}

type Timeout struct {
	Type    string `json:"type"`
	Message string `json:"message"`
}
