import { ErrorCode } from '@/enums/error-code.enum'

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.NO_TOKEN]: 'No authorization token provided',
  [ErrorCode.INVALID_TOKEN]: 'Invalid or expired token',
  [ErrorCode.USER_NOT_FOUND]: 'User not found',
  [ErrorCode.ROLE_NOT_DEFINED]: 'User role not defined',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
  [ErrorCode.INTERNAL_ERROR]: 'Internal Server Error',
  [ErrorCode.BAD_REQUEST]: 'Bad Request',
  [ErrorCode.UNAUTHORIZED]: 'Unauthorized',
  [ErrorCode.FORBIDDEN]: 'Forbidden',
  [ErrorCode.NOT_FOUND]: 'Not Found',
  [ErrorCode.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
}
