import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '../interceptors/cache.interceptor';

export function CacheEndpoint(options?: { ttl?: number }) {
  return applyDecorators(
    SetMetadata('cache_ttl', options?.ttl || 60),
    UseInterceptors(CacheInterceptor),
  );
}
