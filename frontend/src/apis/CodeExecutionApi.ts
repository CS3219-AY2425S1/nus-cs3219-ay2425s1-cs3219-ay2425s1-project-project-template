import { CodeExecutionInput } from '../types/CodeExecutionType';
import { SessionResponse } from '../types/CollaborationType';
import { api } from './ApiClient';

export const executeCode = async (
  data: CodeExecutionInput,
): Promise<SessionResponse> => {
  return api.post('/codex', data);
};
