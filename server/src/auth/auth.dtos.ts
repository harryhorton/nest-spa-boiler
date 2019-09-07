import { IsString, IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';

export class LoginPayload {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RegisterPayload {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class CurrentUserResponse {
  @Exclude()
  password: string;
}
