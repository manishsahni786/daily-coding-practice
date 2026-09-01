import jwt from 'jsonwebtoken';
import { AppError, ERRORS } from '../constants/errorConstant.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Generate a token — used in signup/login
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify a token — used in authMiddleware
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError(ERRORS.TOKEN_EXPIRED);
    }
    throw new AppError(ERRORS.TOKEN_INVALID);
  }
};

// Extract token from Authorization header — used in authMiddleware
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(ERRORS.TOKEN_MISSING);
  }
  return authHeader.split(' ')[1];
};