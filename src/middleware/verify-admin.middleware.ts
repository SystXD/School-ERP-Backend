import { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../lib/structures";
import { handler } from "../lib/utils";
import { Staff } from "../models/staff.model";
import jwt from 'jsonwebtoken'
export const verifyAdmin = handler(async (req, res, next) => {
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
      if (staff.isAdmin === false) throw new ApiError(401, "This route can only be accessed by Admins")
      next();
    } catch (error) {
      throw new ApiError(401, "Unauthorized Request");
    }
})