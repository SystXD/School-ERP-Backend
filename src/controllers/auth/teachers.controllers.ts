import { compare } from "bcrypt";
import { ApiError, ApiResponse } from "../../lib/structures";
import { handler, TimeLimit } from "../../lib/utils";
import { Staff } from "../../models/staff.model";
export const loginTeacher = handler(async (req, res) => {
    const { username, email, password } = req.body as Record<string, string>;
    if ([username, email, password].some((c) => c?.trim() === (undefined || "")))
      throw new ApiError(400, "Missing authentication details");
  
    const staff = await Staff.findOne({ $or: [{ email }, { username }] });
    if (!staff)
      throw new ApiError(
        400,
        "Unable to locate any staff member from provided credentials"
      );
  
    if (!(await compare(password, staff.password)))
      throw new ApiError(401, "Incorrect password provided in credentials");
  
    const [accessToken, refreshToken] = [
      staff.generateAccessToken('Teacher'),
      await staff.generateRefreshToken(staff, 'Teacher'),
    ];
  
    res
      .status(200)
      .cookie("accessToken", accessToken, {
        secure: process.env.NODE_ENV === "development",
        httpOnly: false,
        maxAge: TimeLimit.OneDay,
      })
      .cookie("refreshToken", refreshToken, {
        secure: process.env.NODE_ENV === "development",
        httpOnly: false,
        maxAge: TimeLimit.SevenDay,
      })
      .json(new ApiResponse(200, "The user is now logged in"));
})

export const updateTeacher = handler(async (req, res) => {
    const { username, email, password, updatedValues } = req.body;
    if ([username, email, password, updatedValues].some(c => c?.trim() === (null || ""))) throw new ApiError(400, "Missing authentication details");

    const teacher = await Staff.findOne({ $or: [{ username }, { email }] });
    if (!teacher) throw new ApiError(404, "Unable to locate any teacher with that email/username");

    if (!(await compare(password, teacher.password))) throw new ApiError(401, "Incorrect password provided in credentials");

    if (!(updatedValues instanceof Array)) throw new ApiError(404, "Invalid datatypes received in updateValue props")
})

