import dotenv from 'dotenv';

dotenv.config();

interface Config {
  ROOT_BASE_API: string;
}

const config: Config = {
  ROOT_BASE_API: process.env.ROOT_BASE_API || 'http://192.168.1.32/',
};

export default config;
