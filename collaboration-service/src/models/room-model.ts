export interface Room {
  roomId: string;
  code: string;
  users: { [key: string]: boolean };
  createdAt: number;
  selectedQuestionId: number;
  status: "active" | "inactive";
  currentLanguage: "javascript" | "python" | "csharp" | "java";
}
