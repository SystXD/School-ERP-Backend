import { Types } from "mongoose";
import { ApiError, ApiResponse } from "../../lib/structures";
import { handler } from "../../lib/utils";
import { Section } from "../../models/section.model";
import { Class } from "../../models/class.models";
export const addSection = handler(async (req, res) => {
  const { name, class: sectionClass } = req.body;

  const schoolClass = await Class.findOne({ name: sectionClass });
  if (!schoolClass) throw new ApiError(404, "Unknown class provided in school");
  if (await Section.exists({ name, class: schoolClass._id }))
    throw new ApiError(409, "The section already exist in provided class");

  res.status(200).json(
    new ApiResponse(
      200,
      "The section has been created in school",
      await Section.create({
        class: new Types.ObjectId(schoolClass._id),
        name,
      })
    )
  );
});

