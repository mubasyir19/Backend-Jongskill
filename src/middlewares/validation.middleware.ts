// src/middlewares/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';
import { ResponseUtil } from '../utils/response';

type ZodSchemaGroup = {
  body?: ZodType<any>;
  query?: ZodType<any>;
  params?: ZodType<any>;
};

export const validateRequest = (schemas: ZodSchemaGroup) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          res.status(400).json(ResponseUtil.error('Invalid request body', result.error));
          return;
        }
        req.body = result.data;
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          res.status(400).json(ResponseUtil.error('Invalid query params', result.error));
          return;
        }
        req.query = result.data;
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          res.status(400).json(ResponseUtil.error('Invalid route params', result.error));
          return;
        }
        req.params = result.data;
      }

      next();
    } catch (err) {
      console.log('ada error middleware zod', err);
      if (err instanceof ZodError) {
        res.status(400).json(ResponseUtil.error('Validation error', err));
        return;
      }
      next(err);
    }
  };
};
