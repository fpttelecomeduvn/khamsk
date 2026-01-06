import { IsString, IsEmail, MinLength, IsEnum, IsOptional, IsArray } from 'class-validator';
import { UserRole } from '../../../../shared/types';

export class SignUpDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsArray()
  @IsOptional()
  specialties?: string[];
}

export class SignInDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class AuthResponseDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  specialties: string[];
  accessToken: string;
  expiresIn: number;
}

export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  specialties: string[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}
