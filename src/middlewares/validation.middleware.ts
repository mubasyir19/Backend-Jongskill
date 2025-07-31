// src/middlewares/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ResponseUtil } from '../utils/response';

type ZodSchemaGroup = {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
};

export const validateRequest = (schemas: ZodSchemaGroup) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          res.status(400).json(ResponseUtil.error('Invalid request body', result.error.errors));
          return;
        }
        req.body = result.data;
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          res.status(400).json(ResponseUtil.error('Invalid query params', result.error.errors));
          return;
        }
        req.query = result.data;
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          res.status(400).json(ResponseUtil.error('Invalid route params', result.error.errors));
          return;
        }
        req.params = result.data;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json(ResponseUtil.error('Validation error', err.errors));
        return;
      }
      next(err);
    }
  };
};
