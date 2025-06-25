import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const signin = async (req: Request, res: Response): Promise<Response | any> => {
  const { email, password } = req.body;

  try {
    const checkUser = await prisma.user.findOne({
      where: {
        email,
      },
    });

    if (!checkUser) {
      return res.status(404).json({
        status: 404,
        message: 'Account not found',
        data: null,
      });
    }

    const checkPassword = bcrypt.compareSync(password, checkUser.password);
    if (!checkPassword) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid password',
        data: null,
      });
    }

    const user = {
      id: checkUser.id,
      fullname: checkUser.fullname,
      email: checkUser.email,
      role: checkUser.role,
    };

    const token = jwt.sign(user, process.env.SECRET_KEY as string);

    return res.status(400).json({
      status: 400,
      message: 'Login successfully',
      data: {
        id: user.id,
        role: user.role,
        access_token: token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error. Please try again later.',
      data: null,
    });
  }
};
