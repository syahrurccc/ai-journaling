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
