import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ValidationException } from '../exceptions';
import { Environment } from 'src/configs';
import { STATUS_CODES } from 'http';
import { ErrorDto } from 'src/common/dtos/error.dto';
import { ValidationError } from 'class-validator';
import { ErrorDetailDto } from 'src/common/dtos/error-detail.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private debug: boolean = false;

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.debug = Environment.APP_DEBUG;

    let error: ErrorDto;

    if (exception instanceof UnprocessableEntityException) {
      error = this.handleUnprocessibleEntityException(exception);
    } else if (exception instanceof ValidationException) {
      error = this.handleValidationException(exception);
    } else if (exception instanceof HttpException) {
      error = this.handleHttpException(exception);
    } else {
      error = this.handleError(error as unknown as Error);
    }

    if (this.debug) {
      error.stack = exception.stack;
      error.trace = exception;

      this.logger.debug(error);
    }

    response.status(error.statusCode).json(error);
  }

  private handleValidationException(exception: ValidationException): ErrorDto {
    const r = exception.getResponse() as {
      errorCode: string;
      message: string;
    };

    const statusCode = exception.getStatus();
    const error = {
      timestamp: this.generateTimestamp(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: r.message,
    };

    this.logger.debug(exception);

    return error;
  }

  private handleUnprocessibleEntityException(
    exception: UnprocessableEntityException,
  ): ErrorDto {
    const r = exception.getResponse() as { message: ValidationError[] };
    const statusCode = exception.getStatus();

    const error: ErrorDto = {
      timestamp: this.generateTimestamp(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: 'Validation failed',
      details: this.extractValidationErrorDetails(r.message),
    };

    this.logger.debug(error);

    return error;
  }

  private handleHttpException(exception: HttpException) {
    const statusCode = exception.getStatus();
    const errorResponse = {
      timestamp: this.generateTimestamp(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: exception.message,
    };

    this.logger.debug(exception);

    return errorResponse;
  }

  private handleError(error: Error) {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = {
      timestamp: this.generateTimestamp(),
      statusCode,
      error: STATUS_CODES[statusCode],
      message: error?.message || 'An unexpected error occurred',
    };

    this.logger.debug(errorResponse);

    return errorResponse;
  }

  private extractValidationErrorDetails(errors: ValidationError[]) {
    const extractErrors = (
      error: ValidationError,
      parentProperty: string = '',
    ): ErrorDetailDto[] => {
      const propertyPath = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      const currentErrors: ErrorDetailDto[] = Object.entries(
        error.constraints || {},
      ).map(([code, message]) => ({
        property: propertyPath,
        code,
        message,
      }));

      const childErrors: ErrorDetailDto[] =
        error.children?.flatMap((childError) =>
          extractErrors(childError, propertyPath),
        ) || [];

      return [...currentErrors, ...childErrors];
    };

    return errors.flatMap((error) => extractErrors(error));
  }

  private generateTimestamp() {
    return new Date().toISOString();
  }
}
