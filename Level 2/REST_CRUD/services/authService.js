import bcrypt from 'bcryptjs';
import prisma from '../configs/db.js';
import { AppError, ERRORS } from '../constants/errorConstant.js';
import { generateToken } from '../utils/jwt.utils.js';

export const signupService = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(ERRORS.USER_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = generateToken({ userId: user.id });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
};

export const loginService = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(ERRORS.INVALID_CREDENTIALS);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(ERRORS.INVALID_CREDENTIALS);
  }

  const token = generateToken({ userId: user.id });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
};