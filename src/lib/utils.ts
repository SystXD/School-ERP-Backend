import { NextFunction, Request, Response } from "express";

export const handler =
(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
    (req: Request, res: Response, next: NextFunction) =>
      Promise.resolve(fn(req, res, next)).catch((err) => next(err))


export enum TimeLimit {
  SevenDay = 604800000,
  OneDay = 3600000
}