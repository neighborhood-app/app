import { Request, Response, NextFunction } from 'express';

// Wrapper for async middleware. Catches errors and passes them to error handler.
const catchError = (handler: (req: Request, res: Response, next: NextFunction) => any) => (
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  }
);

export default catchError;
