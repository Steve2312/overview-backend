import { TypeORMError } from 'typeorm';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    console.log(exception);

    const context = host.switchToHttp();
    const request = context.getResponse<Request>();
    const response = context.getResponse<Response>();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    response.status(HttpStatus.BAD_REQUEST.valueOf()).json({
      path: request.url,
      status: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
