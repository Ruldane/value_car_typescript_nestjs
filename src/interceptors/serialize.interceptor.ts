import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

interface ClassConstructor {
  new (...args: any[]): {};
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a resquest is handled by the request handler
    console.log('i am running before the handler', context);
    return handler.handle().pipe(
      map((data: any) => {
        //run something before the response is send out
        console.log('I am running before the response is out', data);
        return plainToInstance(this.dto, data, {
          // will only return the value with expose inside user DTO
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
