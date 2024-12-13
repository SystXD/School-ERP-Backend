import { StudentInfo } from "../../lib/@types/types";
import { ApiError, ApiResponse } from "../../lib/structures";
import { handler, validateSubjects } from "../../lib/utils";
import { Student } from "../../models/student.models";

export const updateExamGrades = handler(async (req, res) => {
  const {
    class: sectionClass,
    guardianName,
    studentName,
    section,
    subjects,
    examName,
    examDate,
    subjectName,
    grade,
  } = req.body;

  const students = await Student.aggregate([
    {
      $lookup: {
        from: "classes",
        localField: "classInfo.class",
        foreignField: "_id",
        as: "classDetails",
      },
    },
    {
      $unwind: "$classDetails",
    },

    {
      $lookup: {
        from: "sections",
        localField: "classInfo.section",
        foreignField: "_id",
        as: "sectionDetails",
      },
    },

    {
      $unwind: "$sectionDetails",
    },
    {
      $match: {
        $and: [
          { name: studentName },
          { $or: [{ fatherName: guardianName }, { motherName: guardianName }] },
          { "classDetails.name": sectionClass, "sectionDetails.name": section },
        ],
      },
    },
  ]);

  if (students.length < 0 || !students)
    throw new ApiError(
      404,
      "Unable to locate students with provided credentials"
    );

  const student = students[0] as StudentInfo;

  if (!Array.isArray(subjects)) throw new ApiError(404, "Bad Request");

  const isValidSubjects = await validateSubjects(subjects).catch(() => {
    throw new ApiError(400, "Bad Request for Subjects");
  });

  if (!isValidSubjects) throw new ApiError(400, "Bad Request for Subjects");

  const index = student.subjects.find((sub) => sub.subjectName === subjectName);

  if (index) {
    await Student.updateOne(
      { _id: student._id, "subjects.subjectName": subjectName },
      { $push: { "subjects.$.exams": { examName, examDate, grade } } }
    );
  } else {
    await Student.updateOne(
      { _id: student._id },
      {
        $push: {
          subjects: { subjectName, exams: [{ examName, examDate, grade }] },
        },
      }
    );
  }

  res.status(200).json(new ApiResponse(200, "Updated student  grades"));
});
