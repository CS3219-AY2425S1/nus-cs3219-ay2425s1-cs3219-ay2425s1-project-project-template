export interface Room {
  roomId: string;
  code: string; 
  users: { [key: string]: boolean }; 
  createdAt: number;
  status: 'active' | 'inactive';
}
  