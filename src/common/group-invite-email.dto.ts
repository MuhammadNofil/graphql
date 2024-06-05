import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GroupInviteEmailDto {
  @IsNotEmpty()
  @IsEmail()
  receiver: string;

  @IsOptional()
  @IsString()
  inviter: string;

  @IsOptional()
  @IsString()
  link: string;

  @IsOptional()
  @IsString()
  groupName: string;
}
