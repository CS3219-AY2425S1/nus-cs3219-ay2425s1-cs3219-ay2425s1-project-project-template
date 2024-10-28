interface UserMatchingRequest {
  _id: string;
  name?: string;
  difficulty?: string;
  topic?: string;
  type: string;
}

interface UserMatchingResponse {
  status: string;
  match: UserMatchingRequest;
}

export type { UserMatchingRequest, UserMatchingResponse };
