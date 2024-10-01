/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        QUESTION_SERVICE_URL: process.env.QUESTION_SERVICE_URL,
        IMAGE_UPLOAD_KEY: process.env.IMAGE_UPLOAD_KEY || undefined,
    },
}

module.exports = nextConfig
