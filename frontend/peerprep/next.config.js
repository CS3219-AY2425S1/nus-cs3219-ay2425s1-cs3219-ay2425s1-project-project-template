/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
        NEXT_PUBLIC_QUESTION_SERVICE_URL: process.env.NEXT_PUBLIC_QUESTION_SERVICE_URL,
        NEXT_PUBLIC_IMAGE_UPLOAD_KEY: process.env.NEXT_PUBLIC_IMAGE_UPLOAD_KEY || undefined,
    },
    // webpack: (config, { isServer }) => {
    //     if (!isServer) {
    //         config.resolve.fallback.fs = false;
    //     }
    
    //     return config;
    // },
}

module.exports = nextConfig
