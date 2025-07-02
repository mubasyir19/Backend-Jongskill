import { PrismaClient } from '@prisma/client';
import bcyrpt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const prisma = new PrismaClient();

interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  async findUserByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email: {
          equals: email,
        },
      },
    });
  }

  async login(data: LoginData) {
    if (!data.email) {
      throw new Error('Email is required');
    }

    if (!data.password) {
      throw new Error('Email is required');
    }

    const existingUser = await this.findUserByEmail(data.email);
    if (!existingUser) {
      throw new Error('Account user not found');
    }

    const checkPassword = bcyrpt.compare(data.password, existingUser.password);
    if (!checkPassword) {
      throw new Error('Invalid Password');
    }

    const user = {
      id: existingUser.id,
      fullname: existingUser.fullname,
      email: existingUser.email,
      role: existingUser.role,
    };

    const jwtToken = jwt.sign(user, env.JWT_SECRET as string);

    return { user, jwtToken };
  }
}

export const authService = new AuthService();
