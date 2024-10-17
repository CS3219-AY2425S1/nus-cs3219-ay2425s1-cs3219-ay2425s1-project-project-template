export interface UserMatchRequest {
  user_id: string;
  socket_id: string;
  difficulty_levels: string[];
  categories: string[];
  programming_languages: string[];
  generalize_languages: boolean;
}

export interface UserMatchResponse {
  message: string;
  user_id: string;
}
