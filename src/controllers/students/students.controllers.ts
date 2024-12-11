import { ApiError, ApiResponse } from "../../lib/structures";
import { handler } from "../../lib/utils";
import { Class } from "../../models/class.models";
import { Section } from "../../models/section.model";
import { Student } from "../../models/student.models";
import { Types } from "mongoose";
export const getStudent = handler(async (req, res) => {
  const { creds } = req.params;
  const { parentName, all, class: studentClass } = req.query;

  let query: Record<string, any> = {};
  if (studentClass)
    query["classInfo.class"] = new Types.ObjectId(studentClass as string);

  if (parentName)
    query["$or"] = [{ fatherName: parentName }, { motherName: parentName }];

  if (creds) query.name = creds;

  if (all === "true") {
    const students = await Student.find();
    res
      .status(200)
      .json(new ApiResponse(200, "Fetched successfully", students));
    return;
  }

  const student = await Student.find(query);
  if (!student)
    throw new ApiError(404, "Unable to locate any student based on query");
  res.status(200).json(new ApiResponse(200, "Fetched successfull", student));
});

export const registerStudent = handler(async (req, res) => {
  const {
    name,
    fatherName,
    dob,
    motherName,
    className,
    section,
  } = req.body;
  const acceptedFields = [
    "name",
    "class",
    "rollNo",
    "fatherName",
    "dob",
    "section",
    "motherName",
    "className",
  ];

  if (
    Object.keys(req.body).filter((v) => !acceptedFields.includes(v)).length > 0
  )
    throw new ApiError(404, "Invalid Request In Body");

  const classExist = await Class.findOne({ name: className });
  if (!classExist) throw new ApiError(404, "Unknown class provided in body");

  const sectionExist = await Section.findOne({ class: classExist._id, name:section });

  if (!sectionExist)
    throw new ApiError(404, "Unknown section provided in body");

  if (
    await Student.exists({
      name,
      $or: [{ fatherName }, { motherName }],
      "classInfo.className": className,
    })
  )
    throw new ApiError(409, "The student already exist in the class");

  const student = await Student.create({
    name,
    fatherName,
    motherName,
    dob,
    "classInfo.class": classExist._id,
    "classInfo.section": sectionExist._id,
    "classInfo.className": className,
    "classInfo.sectionName": section,
  });
  await Section.findOneAndUpdate(
    { class: classExist._id },
    { $push: { students: student._id } }
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Student create successfully", student));
});
