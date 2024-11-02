import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionSubmissionDto } from './create-question-submission.dto';

export class UpdateQuestionSubmissionDto extends PartialType(CreateQuestionSubmissionDto) {}
