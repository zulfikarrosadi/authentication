import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import ApiResponse from '../schema';

export function validateInput(schema: AnyZodObject) {
  return async function (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction,
  ) {
    try {
      schema.parse(req.body);
      return next();
    } catch (error: any) {
      return res.status(400).send({
        status: 'fail',
        errors: {
          message: 'validation errors',
          code: 400,
          details: error.errors
            .map((e: { path: string[]; message: string }) => {
              return {
                [e.path[0]]: e.message,
              };
            })
            .reduce((acc: any, curr: any) => {
              Object.assign(acc, curr);
              return acc;
            }, {}),
        },
      });
    }
  };
}
