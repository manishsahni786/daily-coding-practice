
export const ERRORS = {
  USER_EXISTS: {
    code: 'USER_EXISTS',
    message: 'A user with this email already exists',
    status: 409,
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password',
    status: 401,
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'You are not authorized to access this resource',
    status: 403,
  },
  TOKEN_MISSING: {
    code: 'TOKEN_MISSING',
    message: 'No authentication token provided',
    status: 401,
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: 'Invalid authentication token',
    status: 401,
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Authentication token has expired',
    status: 401,
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    status: 404,
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    status: 400,
  },
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    message: 'Something went wrong, please try again',
    status: 500,
  },
};

// Custom error class — carries code, message, and status together
export class AppError extends Error {
  constructor(errorInfo) {
    super(errorInfo.message);
    this.code = errorInfo.code;
    this.status = errorInfo.status;
  }
}

