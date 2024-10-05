export const config = {
    port: process.env.PORT || 3000,
    matchTimeout: parseInt(process.env.MATCH_TIMEOUT || '30000'),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development',
};