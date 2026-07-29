import { Request } from 'express';

export interface CurrentUser {
  sub: string;
  email: string;
  name: string;
}

export interface AuthUser {
  sub: string;
  email: string;
  username: string;
}

export interface AuthRequest extends Request {
  user: AuthUser;
}
