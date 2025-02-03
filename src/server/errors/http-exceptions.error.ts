import { ErrorCode } from '@/enums/error-code.enum'

import { CustomError } from './custom-error.error'

export class BadRequestException extends CustomError {
  constructor(message: string) {
    super(ErrorCode.BAD_REQUEST, 400, message)
    this.name = 'BadRequestException'
  }
  public status = 400
}

export class UnauthorizedException extends CustomError {
  constructor(message: string) {
    super(ErrorCode.UNAUTHORIZED, 401, message)
    this.name = 'UnauthorizedException'
  }
  public status = 401
}

export class ForbiddenException extends CustomError {
  constructor(message: string) {
    super(ErrorCode.FORBIDDEN, 403, message)
    this.name = 'ForbiddenException'
  }
  public status = 403
}

export class NotFoundException extends CustomError {
  constructor(message: string) {
    super(ErrorCode.NOT_FOUND, 404, message)
    this.name = 'NotFoundException'
  }
  public status = 404
}

export class MethodNotAllowedException extends CustomError {
  constructor(message: string) {
    super(ErrorCode.METHOD_NOT_ALLOWED, 405, message)
    this.name = 'MethodNotAllowedException'
  }
  public status = 405
}

export class InternalServerErrorException extends CustomError {
  constructor(message: string) {
    super(ErrorCode.INTERNAL_ERROR, 500, message)
    this.name = 'InternalServerErrorException'
  }
  public status = 500
}
