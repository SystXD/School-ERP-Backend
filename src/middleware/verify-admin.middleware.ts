import { decode, JwtPayload } from "jsonwebtoken";
import { ApiError } from "../lib/structures";
import { handler } from "../lib/utils";
import { Staff } from "../models/staff.model";
import jwt from "jsonwebtoken";
export const verifyAdmin = handler(async (req, res, next) => {
  const token = req.cookies.accessToken ?? req.body.accessToken;
  if (!token) throw new ApiError(401, "Unauthorized Request");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWTSecret as string
    ) as JwtPayload;

    const staff = await Staff.findOne({ _id: decoded?._id });

    if (!staff) {
      throw new ApiError(401, "Unauthorized Request");
    }
    if (decoded.role?.toLowerCase() !== "admin")
      throw new ApiError(401, "This route can only be used by admins");
    next();
  } catch (error) {
    console.log("accessToken error", error)

    throw new ApiError(401, "Unauthorized Request");
  }
});

export const verifyAdminRefresh = handler(async (req, res, next) => {
  const token = req.cookies.refreshToken ?? req.body.refreshToken;
  if (!token) throw new ApiError(401, "Unauthorized Request");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWTRefreshSecret as string
    ) as JwtPayload;
    const staff = await Staff.findOne({ _id: decoded?._id });

    if (!staff) {
      console.log("No staff found")
      res.clearCookie("refreshToken");
      throw new ApiError(401, "Unauthorized Request");
    }
    if (decoded.role?.toLowerCase() !== "admin")
      throw new ApiError(401, "This route can only be used by admins");

    next();
  } catch (error) {
    console.log('refreshToken Error', error)
    throw new ApiError(401, "Unauthorized Request");
  }
});
