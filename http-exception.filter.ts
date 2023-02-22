import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as { message: any; statusCode: number } | { error: string; statusCode: 400; message: string[] }; // class-validator 타이핑
    console.log('fail response::::::::::', err.statusCode);
    if (typeof err !== 'string' && err.statusCode === 400) {
      // @ts-ignore
      return response.status(status).json({
        success: false,
        httpStatusCode: status,
        message: err.message
      });
    }

    // @ts-ignore
    return response.status(status).json({
      success: false,
      httpStatusCode: status,
      message: err.message
    });
  }
}
