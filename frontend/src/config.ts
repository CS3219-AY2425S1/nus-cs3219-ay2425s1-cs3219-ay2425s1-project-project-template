// import dotenv from 'dotenv';

// dotenv.config();

interface Config {
  ROOT_BASE_API: string;
}

const config: Config = {
  // replace localhost with your IP addr
  ROOT_BASE_API: 'http://localhost/', 
};

export default config;
