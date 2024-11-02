package models

type Collaboration struct {
	Title              string   `json:"title" firestore:"title"`
	Code               string   `json:"code" firestore:"code"`
	Language           string   `json:"language" firestore:"language"`
	User               string   `json:"user" firestore:"user"`
	MatchedUser        string   `json:"matchedUser" firestore:"matchedUser"`
	MatchID            string   `json:"matchId" firestore:"matchId"`
	MatchedTopics      []string `json:"matchedTopics" firestore:"matchedTopics"`
	QuestionDifficulty string   `json:"questionDifficulty" firestore:"questionDifficulty"`
	QuestionTopics     []string `json:"questionTopics" firestore:"questionTopics"`
}
