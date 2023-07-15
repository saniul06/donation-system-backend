export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface IFindUser {
  id?: number;
  email?: string;
  username?: string;
}
