import { db } from '../lib/db/index';
import { questions } from '../lib/db/schema';
import { questionData } from './data/question-data';

const seedQuestions = async () => {
  try {
    await db.transaction(async (trx) => {
      await trx.delete(questions);
      for (const question of questionData) {
        await trx.insert(questions).values(question).onConflictDoNothing();
      }
    });
    for (const question of questionData) {
      await db.insert(questions).values(question);
    }
  } catch (error) {
    console.log('Error seeding question data', error);
    process.exit(1);
  }
};

seedQuestions()
  .then(() => {
    console.log('Seeding completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
  });
