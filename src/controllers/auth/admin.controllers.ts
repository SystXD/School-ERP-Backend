import jwt from "jsonwebtoken";
import { ApiError, ApiResponse } from "../../lib/structures";
import { handler, TimeLimit } from "../../lib/utils";
import { Staff } from "../../models/staff.model";
import { compare, hash } from "bcrypt";
export const loginAdmin = handler(async (req, res) => {
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
    staff.generateAccessToken("Admin"),
    await staff.generateRefreshToken("Admin"),
  ];

  staff.refreshToken = refreshToken;
  await staff.save();

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
      maxAge: TimeLimit.OneDay,
    })
    .json(new ApiResponse(200, "The user is now logged in"));
});

export const registerTeam = handler(async (req, res) => {
  const { username, email, password, isAdmin, department } = req.body as Record<
    string,
    string
  >;

  if (
    [username, email, password]?.some(
      (cred) => cred?.trim() === (undefined || "")
    )
  )
    throw new ApiError(400, "Missing authentication details");

  const isDuplicated = await Staff.exists({ email });
  if (isDuplicated)
    throw new ApiError(409, "Already a user exist with that email");

  const hasedPassword = await hash(password, 10);
  const document = await Staff.create({
    username,
    email,
    isAdmin,
    password: hasedPassword,
    department,
  });

  res
    .status(200)
    .json(new ApiResponse(200, "The staff has been created.", document));
});

export const updateStaff = handler(async (req, res) => {
  const { creds } = req.params;
  if (!creds) throw new ApiError(400, "Invalid or Missing Params in Request");

  const acceptedFields = [
    "username",
    "email",
    "password",
    "department",
    "isAdmin",
  ];
  const invalidFields = Object.keys(req.body).filter(
    (v) => !acceptedFields.includes(v)
  );
  if (invalidFields.length > 0) throw new ApiError(400, "Invalid JSON in body");
  const staff = await Staff.findOne({
    $or: [{ email: creds }, { username: creds }],
  });
  if (!staff)
    throw new ApiError(
      400,
      "Unable to locate any staff with provided credentials"
    );

  Object.assign(staff, req.body);
  await staff.save();

  res.status(200).json(new ApiResponse(200, "The staff values are updated"));
});

export const getStaff = handler(async (req, res) => {
  const { all } = req.query;
  const { creds } = req.params;
  if (Object.keys(req.params).length > 1)
    throw new ApiError(400, "More than 1 Params Received in Request");

  if (creds) {
    res.status(200).json(
      new ApiResponse(200, "Fetched all staffs", {
        value: await Staff.findOne({
          $or: [{ email: creds }, { username: creds }],
        }).select("-password -accessToken -refreshToken"),
      })
    );
  
  } else if (all) {
    res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Fetched all staffs",
        await Staff.find().select("-password -accessToken -refreshToken")
      )
    );
  } else {
    res.status(400).json(new ApiResponse(404, "Invalid Request Or Params"));
  }
});

