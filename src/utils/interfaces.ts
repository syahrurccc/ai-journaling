import type { Request } from "express";

export type AuthedRequest<P = any> = Request<P> & { userId: string };