/* [Imports] */

import fs from 'fs/promises';
import { Question } from "../../model";
import logger from "../../utils/logger";

/* [Setup] */

const QUESTIONS: Question[] = [];

beforeAll(() => {
  return fs.readFile('./data/questions.json')
    .then((raw: any) => {
      QUESTIONS.push(
        ...JSON.parse(raw) as Question[]
      );
      logger.info("Read sample questions from JSON file:");
      logger.info(
        `${JSON.stringify(QUESTIONS).slice(0, 500)}...`
      );
    }).catch((error) => {
      logger.error(error)
    });
});

/* [Tests] */

// [getAllQuestionsWithConditions]

//TODO
test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});

//TODO
