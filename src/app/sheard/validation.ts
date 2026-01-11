import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

const validateRequest =
  (zodSchema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let body = req.body?.data || req.body;

      if (typeof body === "string") {
        body = JSON.parse(body);
      }
      const parse = await zodSchema.parseAsync(body);

      req.body = parse;
      console.log("console from validate", req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
