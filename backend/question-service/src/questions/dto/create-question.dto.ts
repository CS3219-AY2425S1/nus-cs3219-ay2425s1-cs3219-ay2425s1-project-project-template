export class CreateQuestionDto {
  questionId: string;
  title: string;
  description: string;
  categories: string[];
  complexity: string;
}
