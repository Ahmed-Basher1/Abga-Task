import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled by the request handler

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        // Transform the data to TaskDto format with the class-transformer
        const transformedData = plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });

        // Return the data in the desired format
        return { data: transformedData };
      }),
    );
  }
}
