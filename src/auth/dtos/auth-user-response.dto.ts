import { Role } from '@prisma/client';

export class AuthUserResponseDto {
  id: string;
  email: string;
  role: Role;
}
