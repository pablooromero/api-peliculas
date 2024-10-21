import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/core';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: RoleEnum[]) => {
    return SetMetadata(META_ROLES, args);
}
