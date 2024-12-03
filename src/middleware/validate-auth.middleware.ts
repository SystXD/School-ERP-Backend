import { ApiError } from "../lib/structures";
import { handler } from "../lib/utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Staff } from "../models/staff.model";
export const verifyJWTRefresh = handler(async (req, res, next) => {
  const token = req.cookies.refreshToken ?? req.body.refreshToken;
  if (!token) throw new ApiError(401, "Unauthorized Request");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWTRefreshSecret as string
    ) as JwtPayload;
    const staff = await Staff.findOne({ _id: decoded?._id });
    if (!staff) {
      res.clearCookie("refreshToken");
      throw new ApiError(401, "Unauthorized Request");
    }
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized Request");
  }
});
