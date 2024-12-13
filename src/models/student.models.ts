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
        class: { type: Schema.Types.ObjectId, ref: "Class" },
        rollNo: { type: String, required: false },
        section: { type: Schema.Types.ObjectId, required: true },
        sectionName: { type: String, required: true },
        className: { type: String, required: true },
      },

      dob: {
        type: String,
        required: true,
      },

      fatherName: {
        type: String,
        required: true,
      },

      motherName: {
        type: String,
        required: true,
      },

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

      studentID: {
        type: String,
        default: crypto.randomUUID(),
      },
    },
    { timestamps: true }
  )
 
);
