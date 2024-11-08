export interface UserInfo {
    userName: string;
    userId: string;
    questionId: string;
    token: string;
  }
  
  export interface AttemptData {
    userId: string;
    questionId: string;
    peerUserName?: string;
    timeTaken: number;
    codeContent: string | null;
    language: string | null;
  }
  
  export interface JoinCollabData {
    roomId: string;
    userName: string;
    userId: string;
    questionId: string;
    token: string;
  }
  
  export interface CodeUpdateData {
    roomId: string;
    code: string;
  }
  
  export interface MessageData {
    roomId: string;
    userName: string;
    message: string;
  }
  
  export interface LeaveCollabData {
    roomId: string;
    codeContent: string;
  }
  
  interface TestTemplateCode {
    python: string;
    java: string;
    javascript: string;
  }

  export interface RunCodeData {
    roomId: string;
    code: string;
    language: string;
    testCases: Array<{ input: any[]; output: any[] }> | null;
    testTemplateCode: TestTemplateCode | null;
  }


  export interface ChangeLanguageData {
    roomId: string;
    newLanguage: string;
  }