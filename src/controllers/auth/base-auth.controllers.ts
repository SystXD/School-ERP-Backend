import { JwtPayload } from "jsonwebtoken";
import { ApiError, ApiResponse } from "../../lib/structures";
import { handler } from "../../lib/utils";
import { Staff } from "../../models/staff.model";
import jwt from 'jsonwebtoken';

export const logoutStaff = handler(async (req, res) => {
    const [decodedRefreshToken, decodedAccessToken] = [
      req.cookies.refreshToken ?? req.body.refreshToken,
      req.cookies.accessToken ?? req.body.accessToken,
    ];
  
    if ([decodedAccessToken, decodedRefreshToken].some((c) => c == undefined))
      throw new ApiError(401, "You are not logged in");
  
    try {
      const [refreshToken, accessToken] = [
        jwt.verify(
          decodedRefreshToken,
          process.env.JWTRefreshSecret as string
        ) as JwtPayload,
        jwt.verify(
          decodedAccessToken,
          process.env.JWTSecret as string
        ) as JwtPayload,
      ];
  
      const staff = await Staff.findById(refreshToken?._id);
  
      if (staff) {
        staff.refreshToken = undefined;
        await staff.save();
      }
  
      res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, "Cookies has been cleared"));
    } catch (error) {
      res.json(error);
    }
});
  