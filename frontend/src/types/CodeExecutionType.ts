import { langs } from '@uiw/codemirror-extensions-langs';

export type SupportedLanguage = Extract<
  keyof typeof langs,
  'python' | 'javascript' | 'cpp'
>;

export type CodeExecutionInput = {
  code: string;
  language: SupportedLanguage;
  input?: string;
};
