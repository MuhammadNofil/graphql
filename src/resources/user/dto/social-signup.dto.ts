import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SocialSignUpUserDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: `Password Must Be Longer Than 8 Characters` })
  @MaxLength(20, { message: `Password Must Be Less Than 20 Characters` })
  @Matches(/((?=.*[a-z])(?=.*[A-Z]))/, { message: `Password Must Contain Upper Case Letter & Lower Case Letters` })
  @Matches(/((?=.*[0-9]))/, { message: `Password Must Contain a number from 0-9` })
  password: string;
}
