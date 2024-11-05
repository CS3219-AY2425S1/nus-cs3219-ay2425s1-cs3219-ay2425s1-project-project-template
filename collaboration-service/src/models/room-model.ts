export interface Room {
  roomId: string;
  code: string;
  users: { [key: string]: boolean };
  createdAt: string;
  selectedQuestionId: number;
  status: "active" | "inactive";
  currentLanguage: "javascript" | "python" | "csharp" | "java";
}
