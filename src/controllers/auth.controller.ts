import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { ResponseUtil } from '../utils/response';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const handleLogin = await authService.login({ email, password });
      res.json(
        ResponseUtil.success({
          id: handleLogin.user.id,
          fullname: handleLogin.user.fullname,
          email: handleLogin.user.email,
          role: handleLogin.user.role,
          access_toke: handleLogin.jwtToken,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    const { fullname, email, password, role } = req.body;

    try {
      const handleRegister = await authService.register({ fullname, email, password, role });

      res.status(201).json(ResponseUtil.success(handleRegister, 'Registration successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
