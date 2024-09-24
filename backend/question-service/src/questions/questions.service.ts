import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, QuestionDocument } from './schemas/question.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const newQuestion = new this.questionModel(createQuestionDto);
    return newQuestion.save();
  }

  async findAll(): Promise<Partial<Question>[]> {
    return this.questionModel
      .find()
      .select('questionId title categories complexity')
      .exec();
  }

  async findOne(questionId: string): Promise<Question> {
    const questionById = await this.questionModel
      .findOne({ questionId })
      .exec();
    if (!questionById) {
      throw new NotFoundException(
        `There is no question with the ID ${questionId}`,
      );
    }

    return questionById;
  }

  async update(
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const questionToUpdate = await this.questionModel
      .findOneAndUpdate({ questionId }, updateQuestionDto, { new: true })
      .exec();
    if (!questionToUpdate) {
      throw new NotFoundException(`There is no question with ID ${questionId}`);
    }

    return questionToUpdate;
  }

  async remove(questionId: string): Promise<Question> {
    const questionToDelete = await this.questionModel
      .findOneAndDelete({ questionId })
      .exec();
    if (!questionToDelete) {
      throw new NotFoundException(`There is no question with ID ${questionId}`);
    }

    return questionToDelete;
  }
}
