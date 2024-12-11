import { NextFunction, Request, Response } from "express";
import { ApiError, ApiResponse } from "../lib/structures";
import mongoose from "mongoose";

export const errorMiddleware = (error:any, req:Request, res:Response, next:NextFunction) => {
   const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500
   const message = error.message ?? "Something went wrong"
   error = new ApiError(statusCode, message, error?.errors || [], error.stack);


   res
   .status(statusCode)
   .json(new ApiResponse(statusCode, message, error))
}