import bcrypt from 'bcryptjs';
import prisma from '../configs/db.js';
import { AppError, ERRORS } from '../constants/errorConstant.js';

export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
  });
  return users;
};

export const getUserByIdService = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
  });

  if (!user) {
    throw new AppError(ERRORS.USER_NOT_FOUND);
  }

  return user;
};

export const updateUserService = async (id, { name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!existingUser) {
    throw new AppError(ERRORS.USER_NOT_FOUND);
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: updateData,
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
  });

  return updatedUser;
};

export const deleteUserService = async (id) => {
  const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!existingUser) {
    throw new AppError(ERRORS.USER_NOT_FOUND);
  }

  await prisma.user.delete({ where: { id: Number(id) } });
  return { message: 'User deleted successfully' };
};