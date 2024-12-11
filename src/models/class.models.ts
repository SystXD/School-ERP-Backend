import { model, Schema } from "mongoose";
import { Section } from "./section.model";

export const Class = model(
  "Class",
  new Schema(
    {
      name: { type: String, required: true },
      section: [{ name: { type: String, required: true }, _id: { type: String } }],
      totalStudents: { type: Number, default: 0 },
    },
    { timestamps: true }
  )
);
