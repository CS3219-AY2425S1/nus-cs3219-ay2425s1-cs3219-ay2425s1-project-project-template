export interface User {
  accessToken: string;
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export const userToString = (user: User | undefined): string => {
  if(!user) {
    /* user is undefined */
    return "undefined";
  }
  return `Access Token: ${user.accessToken},
   User(ID: ${user.id},
   Username: ${user.username},
   Email: ${user.email},
   Is Admin: ${user.isAdmin})`;
};
