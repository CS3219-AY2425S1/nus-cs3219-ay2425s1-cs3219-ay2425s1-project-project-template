package models

type Question struct {
	ID          int    `bson:"_id"`
	Title       string `bson:"title"`
	Description string `bson:"description"`
	Categories  string `bson:"categories"`
	Complexity  string `bson:"complexity"`
	Link        string `bson:"link"`
}
