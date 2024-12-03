import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { IStaff } from "../lib/@types/types";
export const Staff = model<IStaff>(
  "Staff",
  new Schema<IStaff>(
    {
      username: {
        type: String,
        required: true,
        minLength: [3, "Must be atleast 3 characters long"],
      },
      password: {
        type: String,
        required: true,
        minLength: [3, "Must be atleast 3 characters long"],
      },
      email: {
        type: String,
        required: true,
        minLength: [3, "Must be atleast 3 characters long"],
      },
      isAdmin: { type: Boolean, default: false },
      refreshToken: { type: String, required: false },
      department: { type: String, required: false,  },
      suspended: { type: Boolean, default: false }
    },
    {
      timestamps: true,
      methods: {
        generateAccessToken(role:string) {
          return jwt.sign(
            {
              _id: this._id,
              username: this.username,
              role: role
            },
            process.env.JWTSecret as string,
            { expiresIn: "1d" }
          );
        },
        async generateRefreshToken(this, role:string) {
          const token = jwt.sign(
            {
              _id: this._id,
              role: role
            },
            process.env.JWTRefreshSecret as string,
            { expiresIn: "7d" }
          );
          this.refreshToken = token;
          await this.save();
          return token;
        },
      },
    }
  )
);
