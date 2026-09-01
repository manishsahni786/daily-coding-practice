import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from '../services/userService.js';
import { AppError, ERRORS } from '../constants/errorConstant.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
      throw new AppError(ERRORS.VALIDATION_ERROR);
    }

    const updatedUser = await updateUserService(id, { name, email, password });
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteUserService(id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};