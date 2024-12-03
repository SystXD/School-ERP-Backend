import { Document } from "mongoose";

export interface IStaff extends Document {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  refreshToken: string | undefined
  department:string;
  suspended?: boolean;
  generateAccessToken(role:string): string;
  generateRefreshToken(staff:this, role:string): Promise<string>;
}
