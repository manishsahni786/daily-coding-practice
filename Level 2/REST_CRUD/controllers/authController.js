import { signupService, loginService } from '../services/authService.js';
import { AppError, ERRORS } from '../constants/errorConstant.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new AppError(ERRORS.VALIDATION_ERROR);
    }
    const result = await signupService({ name, email, password });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(ERRORS.VALIDATION_ERROR);
    }
    const result = await loginService({ email, password });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};