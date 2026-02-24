import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

const validateRequest =
  (zodSchema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let body = req.body?.data || req.body;
      console.log(body, "this is body");
      if (typeof body === "string") {
        body = JSON.parse(body);
      }
      req.body = await zodSchema.parseAsync(body);
      console.log(req.body, "hello");
      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
