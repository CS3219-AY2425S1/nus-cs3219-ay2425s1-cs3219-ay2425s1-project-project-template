export interface Question {
	question_id: string;
	question_title: string;
	question_description: string;
	question_categories: string[];
	question_complexity: string;
}
// defined to match json keys from questions service
// todo: figure out a better way to handle this (reminder: camelCase)