import { NextFunction, Request, Response } from "express";
import { ExamsOption, ExamInterface } from "./@types/types";

export const handler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));

export enum TimeLimit {
  SevenDay = 604800000,
  OneDay = 3600000,
}

export const validateSubjects = (subjects: Record<string, any>[]): Promise<boolean> => {
  return new Promise((res, rej) => {
    (subjects as ExamsOption[]).forEach((subject) => {
      if (!subject.subjectName)
        return rej(false);

      if (
        !subject.exams ||
        !Array.isArray(subject.exams) ||
        subject.exams.length < 0
      )
        return rej(false);

      subject.exams.forEach((exam) => {
        if (!exam.examDate || !exam.examName || !exam.grade)
          return rej(false);
      });
    });

    return res(true);
  });
};
