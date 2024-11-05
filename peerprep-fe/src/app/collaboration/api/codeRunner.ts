import { LANGUAGE_EXTENSION, LANGUAGE_VERSIONS } from '@/lib/constants';
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://emkc.org/api/v2/piston',
});

export const executeCode = async (language: string, sourceCode: string) => {
  const response = await API.post('/execute', {
    language: LANGUAGE_EXTENSION[language],
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        name: 'main.' + LANGUAGE_EXTENSION[language],
        content: sourceCode,
      },
    ],
    stdin: '', // Add stdin field
    args: [], // Add args field
    compile_timeout: 10000, // Add compile timeout
    run_timeout: 10000, // Add run timeout
  });
  return response.data.run.output;
};
