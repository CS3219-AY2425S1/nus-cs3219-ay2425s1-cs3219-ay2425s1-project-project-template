import app from './app';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' })
const PORT: string | undefined = process.env.PORT

app.listen(PORT, () => {
    console.log(`User service is running on port ${PORT}`);
});
