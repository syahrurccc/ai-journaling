import type { Request } from "express";

export type AuthedRequest<P = any> = Request<P> & { userId: string };

export type Journal = {
  content: string;
  id: string;
  createdAt: Date;
  userId: string;
};

export type JournalRepository = {
  create(userId: string, content: string): Promise<Journal>;
  getOne(id: string): Promise<Journal>;
  getMany(userId: string, from?: string, to?: string): Promise<Journal[]>;
  deleteOne(id: string): Promise<void>;
};

export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
};

export type UserRepository = {
  doesExist(email: string): Promise<boolean>;
  create(email: string, password: string): Promise<void>;
  findOne(email: string): Promise<User | undefined>;
};
