import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { PrismaClient } from '../../prisma/generated/prisma';

const prisma = new PrismaClient();

interface LoginData {
  email: string;
  password: string;
}

type RegisterData = {
  fullname: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN';
};

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

    const checkPassword = await bcrypt.compare(data.password, existingUser.password);
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

  async register(data: RegisterData) {
    const existingUser = await this.findUserByEmail(data.email);

    if (existingUser) {
      throw new Error('An Account already exist');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await prisma.user.create({
      data: {
        fullname: data.fullname,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    return { newUser };
  }
}

export const authService = new AuthService();
