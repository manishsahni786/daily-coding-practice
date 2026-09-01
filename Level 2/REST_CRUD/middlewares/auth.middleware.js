import { extractTokenFromHeader, verifyToken } from '../utils/jwt.utils.js';

export const authMiddleware = (req, _res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers['authorization']);
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};