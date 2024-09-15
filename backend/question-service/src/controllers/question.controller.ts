import { ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Query, Param, Put, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDto, UpdateQuestionDto, FilterQuestionsDto } from '../dto/question.dto';
import { Question } from '../schemas/question.schema';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @ApiResponse({ status: 201, description: 'Create a new question' })
    @Post()
    async create(@Body() createQuestionDto: CreateQuestionDto): Promise<Question> {
        return this.questionService.create(createQuestionDto);
    }

    @ApiResponse({ status: 200, description: 'Get all questions' })
    @Get()
    async findAll(): Promise<Question[]> {
        return this.questionService.findAll();
    }

    @ApiResponse({ status: 200, description: 'Get a question by id' })
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Question> {
        return this.questionService.findOne(id);
    }

    @ApiResponse({ status: 200, description: 'Update a question by id' })
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto): Promise<Question> {
        return this.questionService.update(id, updateQuestionDto);
    }

    @ApiResponse({ status: 200, description: 'Delete a question by id' })
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Question> {
        return this.questionService.delete(id);
    }

    @ApiResponse({ status: 200, description: 'Filter questions' })
    @Get('filter')
    @UsePipes(new ValidationPipe({ transform: true }))
    async filterQuestions(@Query() filterQuestionsDto: FilterQuestionsDto): Promise<Question[]> {
        return this.questionService.filterQuestions(filterQuestionsDto);
    }

    @ApiResponse({ status: 200, description: 'Get a random question' })
    @Get('random')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getRandomQuestion(@Query() filterQuestionsDto: FilterQuestionsDto): Promise<Question | null> {
        return this.questionService.getRandomQuestion(filterQuestionsDto);
    }

}
