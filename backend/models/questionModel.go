package models

type Question struct {
	ID          string `bson:"_id" json:"_id"`
	Title       string `bson:"title"`
	Description string `bson:"description"`
	Categories  string `bson:"categories"`
	Complexity  string `bson:"complexity"`
	Link        string `bson:"link"`
}
