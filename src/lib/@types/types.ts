import { Document, Schema } from "mongoose";
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


export interface StudentInfo extends Document {
  name: string;
  classInfo: {
    class: Schema.Types.ObjectId,
    rollNo?:String,
    section: String,
    sectionName: String,
    className: String,
  },

  dob: String

  fatherName: String

  motherName: String

  subjects: [
    {
      subjectName: { type: String },
      exams: [
        {
          examName: { type: String, required: true },
          examDate: { type: String },
          grade: { type: String, required: true },
        },
      ],
    },
  ],

  studentID:String
}
