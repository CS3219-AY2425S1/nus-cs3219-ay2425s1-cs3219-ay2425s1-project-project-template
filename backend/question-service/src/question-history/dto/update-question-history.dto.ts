import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionHistoryDto } from './create-question-history.dto';

export class UpdateQuestionHistoryDto extends PartialType(CreateQuestionHistoryDto) {}
