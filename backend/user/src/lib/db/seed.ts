import { generatePasswordHash } from '@/lib/passwords';
import { db, users as usersTable } from '.';

const TEST_USER_CREDENTIALS = {
  username: 'testuser01',
  email: 'test_user@email.com',
  firstName: 'test',
  lastName: 'user',
  password: '12345678', // For local testing purposes
};

const main = async () => {
  await db.transaction(async (tx) => {
    // Clear all users
    try {
      await tx.delete(usersTable);

      const password = generatePasswordHash(TEST_USER_CREDENTIALS.password);
      // Insert
      await tx
        .insert(usersTable)
        .values({
          ...TEST_USER_CREDENTIALS,
          password,
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error('[Users]: An error occurred while seeding: ' + String(error));
      process.exit(1);
    }
  });
};

void main()
  .catch((err) => {
    if (err !== null) {
      console.error('[Users]: Error occurred during seeding: ' + String(err));
      process.exit(1);
    }
  })
  .then(() => {
    console.log('[Users]: Seeding completed successfully');
    process.exit(0);
  });
