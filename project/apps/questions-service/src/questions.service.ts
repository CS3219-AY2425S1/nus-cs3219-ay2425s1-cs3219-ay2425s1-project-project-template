import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionsService {
  private readonly questions = [
    { id: '1', title: 'What is NestJS?', userId: '1' },
    // ...other questions
  ];

  findById(id: string) {
    return this.questions.find((question) => question.id === id);
  }
}
