import { Document } from "mongoose";
import { Student } from "../../models/student.models";

export interface IStaff extends Document {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  refreshToken: string | undefined
  department:string;
  suspended?: boolean;
  generateAccessToken(role:string): string;
  generateRefreshToken(role:string): Promise<string>;
}



export type ExamInterface = {
  examName?: string
  examDate?:string,
  grade?: String
}

export type ExamsOption = {
  subjectName?:"Mathematics",
  exams: ExamInterface[]
}

