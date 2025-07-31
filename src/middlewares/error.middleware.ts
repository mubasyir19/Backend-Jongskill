import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ResponseUtil } from '../utils/response';
import { env } from '../config/env';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        res.status(409).json(ResponseUtil.error('Data already exists', err.meta));
      case 'P2025':
        res.status(404).json(ResponseUtil.error('Record not found'));
      default:
        res.status(400).json(ResponseUtil.error('Database error', err.meta));
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(ResponseUtil.error('Invalid token'));
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json(ResponseUtil.error('Token expired'));
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  res.status(statusCode).json(ResponseUtil.error(message, env.NODE_ENV === 'development' ? err.stack : undefined));
};
