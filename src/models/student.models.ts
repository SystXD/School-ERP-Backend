import { model, Schema } from "mongoose";

export const Student = model(
  "Student",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      classInfo: {
        class: { type: Schema.Types.ObjectId, ref: 'Class'},
        rollNo: { type: String, required: true },
      },

      dob: {
        tyoe: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);
