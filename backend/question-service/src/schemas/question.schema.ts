import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export enum QuestionComplexity {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}

export enum QuestionTopics {
    ARRAY = 'array',
    BINARY = "binary",
    BINARY_SEARCH = "binary_search",
    BINARY_SEARCH_TREE = "binary_search_tree",
    BINARY_TREE = "binary_tree",
    DYNAMIC_PROGRAMMING = "dynamic_programming",
    GRAPH = "graph",
    GREEDY = "greedy",
    HASH_TABLE = "hash_table",
    HEAP = "heap",
    LINKED_LIST = "linked_list",
    MATH = "math",
    MATRIX = "matrix",
    QUEUE = "queue",
    RECURSION = "recursion",
    SORTING = "sorting",
    STACK = "stack",
    STRING = "string",
    TRIE = "trie"
}

@Schema()
export class Question extends Document {
    @Prop({ type: Types.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    topics: QuestionTopics[];

    @Prop({ required: true })
    complexity: QuestionComplexity;

    @Prop({ required: true })
    link: string;

}

export const QuestionSchema = SchemaFactory.createForClass(Question);