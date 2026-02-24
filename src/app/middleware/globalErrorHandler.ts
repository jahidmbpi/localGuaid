import { NextFunction, Request, Response } from "express";
import { TErrorResponse } from "../interface/error.types";
import { handleDuplicateError } from "../helper/handelduplicateerror";
import { ZodError } from "zod";
import { handleZodError } from "../helper/handelZodError";
import { envVars } from "../config/env";

export const globalErrorhandelar = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let ststusCode = 500;
  let message = "something went wrong";
  let errorSources: TErrorResponse[] = [];

  if (err.code === 11000) {
    const simplified = handleDuplicateError(err);
    ststusCode = simplified.statusCode;
    message = simplified.message;
  } else if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    ststusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = simplified.errorSources || [];
  }
  res.status(ststusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : undefined,
    stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
  });
};
