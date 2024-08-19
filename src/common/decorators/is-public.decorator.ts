import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export function IsPublic() {
  return applyDecorators(
    SetMetadata('isPublic', true),
    SetMetadata('swagger/apiSecurity', ['']),
  );
}
