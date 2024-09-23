import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question } from './schema/question.schema';
import { CreateQuestionDto, GetQuestionsResponse } from './dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Question') private readonly questionModel: Model<Question>,
  ) {}

  async getQuestions(
    page: number,
    limit: number,
    query: string,
    difficulty: string,
    categories: string[],
  ): Promise<GetQuestionsResponse> {
    const skip = (page - 1) * limit;
    const filters: any = {};
    if (difficulty) {
      filters.difficulty = difficulty;
    }

    if (categories && categories.length > 0) {
      filters.categories = { $in: categories };
    }

    if (query) {
      filters.title = { $regex: query, $options: 'i' };
    }

    const attributes = {
      title: 1,
      slug: 1,
      questionId: 1,
      difficulty: 1,
      categories: 1,
    };
    try {
      // Get the total count of documents matching the filters
      const totalCount = await this.questionModel
        .countDocuments(filters)
        .exec();

      // Fetch the paginated questions
      const questions = await this.questionModel
        .find(filters)
        .skip(skip)
        .limit(limit)
        .select(attributes)
        .exec();

      // Fetch all unique categories from the questions collection
      const categoriesAggregation = await this.questionModel
        .distinct('categories')
        .exec();

      return {
        questions,
        totalCategories: categoriesAggregation,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async getQuestionDetailsBySlug(slug: string): Promise<Question> {
    const question = await this.questionModel.findOne({ slug }).exec();

    if (!question) {
      throw new RpcException('Question not found');
    }
    return question;
  }

  async createQuestion(data: CreateQuestionDto): Promise<Question> {
    const { title, description, difficulty, categories } = data;
    try {
      // Check if question with the same title already exists
      const existingQuestion = await this.questionModel
        .findOne({ title })
        .exec();

      if (existingQuestion) {
        throw new RpcException('Question with the same title already exists');
      }

      // Find the last inserted document to determine the next questionNumber
      const lastQuestion = await this.questionModel
        .findOne({}, { questionNumber: 1 }, { sort: { questionNumber: -1 } })
        .exec();

      const questionNumber = lastQuestion ? lastQuestion.questionNumber + 1 : 1;

      const slug = title.toLowerCase().replace(/ /g, '-');

      const newQuestion = new this.questionModel({
        title,
        description,
        difficulty,
        categories,
        questionNumber,
        slug,
      });

      return newQuestion.save();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async deleteQuestion(id: string): Promise<boolean> {
    try {
      const deletedQuestion = await this.questionModel
        .findOneAndDelete({ _id: new Types.ObjectId(id) })
        .exec();

      if (!deletedQuestion) {
        throw new RpcException('Question not found');
      }

      return true;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
