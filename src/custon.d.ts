import { Request } from 'express';

declare module 'express' {
  export interface Request {
    userId?: string;
  }
}

declare namespace Express {
    export interface Request {
      body: {
        username: string;
        email: string;
        password: string;
        // Add other properties if needed
      }
    }
  }