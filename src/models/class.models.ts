import { model, Schema } from "mongoose";

export const Class = model(
  "Class",
  new Schema(
    {
      name: { type: String, required: true },
      totalStudents: { type: String, required: true },
    },
    { timestamps: true }
  )
);
