import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../lib/structures";

export const errorMiddleware = (error:any, req:Request, res:Response, next:NextFunction) => {
   
   res
   .status(error.statusCode)
   .json(new ApiResponse(error.statusCode, error.message))
}