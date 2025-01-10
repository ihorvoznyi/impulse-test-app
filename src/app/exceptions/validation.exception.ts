import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(error, message?: string) {
    super({ errorCode: error, message });
  }
}
