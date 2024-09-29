import { sql } from 'drizzle-orm';

import { db, questions } from '@/lib/db';
import { questionData } from './sample-data/questions';

const seedQuestions = async () => {
  try {
    await db.transaction(async (trx) => {
      // Delete all questions (not table)
      await trx.delete(questions);

      // Reset Serial to start index 1
      await trx.execute(sql`
      SELECT setval(
          pg_get_serial_sequence('questions', 'id'),
          COALESCE(max(id) + 1, 1), 
          false
      )
      FROM questions;  
      `);

      for (const question of questionData) {
        await trx
          .insert(questions)
          .values({ ...question, id: undefined }) // Let DB set ID
          .onConflictDoNothing();
      }
    });
  } catch (error) {
    console.log('Error seeding question data', error);
    process.exit(1);
  }
};

void seedQuestions()
  .then(() => {
    console.log('Seeding completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
  });
