import { ApiError, ApiResponse } from "../../lib/structures";
import { handler } from "../../lib/utils";
import { Class } from "../../models/class.models";
import { Section } from "../../models/section.model";

export const registerClass = handler(async (req, res) => {
    const { name, sections } = req.body;
    if (!name || !sections) throw new ApiError(400, "Unknown credentials")

        console.log(sections, typeof sections)
    if (!Array.isArray(sections) || (sections as string[]).some(c => typeof c !== "string")) throw new ApiError(400, "Unable to parse sections");


    const schoolClass = await Class.create({ name });
    for (const section of (sections as string[])) {
            const createdSection = await Section.create({
                class: schoolClass._id,
                name: section
            })

            schoolClass.section.push({ name: section, _id: createdSection._id })
    }

    await schoolClass.save()
    res
    .status(200)
    .json(new ApiResponse(200, "The class has been created successfully", Class))
})