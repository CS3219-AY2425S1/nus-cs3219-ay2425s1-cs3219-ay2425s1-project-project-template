import app from './app';
import { connectToDB, upsertManyQuestions } from './models';
import { getDemoQuestions } from './utils/data';

const port = process.env.QUESTION_PORT || 8081;

connectToDB()
    .then(async () => {
        console.log('MongoDB connected successfully');
        return await getDemoQuestions();
    })
    .then(questions => upsertManyQuestions(questions))
    .then(() => {
        console.log('Questions synced successfully');
        app.listen(port, () => console.log(`Question service is listening on port ${port}.`));
    })
    .catch(error => {
        console.error('Failed to start server');
        console.error(error);
    });
