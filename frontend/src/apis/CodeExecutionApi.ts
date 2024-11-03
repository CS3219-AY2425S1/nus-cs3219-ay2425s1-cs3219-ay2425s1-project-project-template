import {
  CodeExecutionInput,
  CodeExecutionResponse,
} from '../types/CodeExecutionType';
import { api } from './ApiClient';

export const executeCode = async (
  data: CodeExecutionInput,
): Promise<CodeExecutionResponse> => {
  return api.post('/codex', data);
};
