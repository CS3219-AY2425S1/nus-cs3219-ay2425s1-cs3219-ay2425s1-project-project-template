import app from './app';
import { config } from './config/envConfig';

const PORT: string | number = config.port

app.listen(PORT, () => {
    console.log(`User service is running on port ${PORT}`);
});
