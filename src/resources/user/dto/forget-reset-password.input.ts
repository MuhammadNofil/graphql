import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  maxLength,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class ForgetResetPasswordInput {
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: `Password Must Be Longer Than 8 Characters` })
  @MaxLength(20, { message: `Password Must Be Less Than 20 Characters` })
  @Matches(/((?=.*[a-z])(?=.*[A-Z]))/, {
    message: `Password Must Contain Upper Case Letter & Lower Case Letters`,
  })
  @Matches(/((?=.*[0-9]))/, {
    message: `Password Must Contain a number from 0-9`,
  })
  @Field(() => String, { description: 'User email', nullable: false })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: `Password Must Be Longer Than 8 Characters` })
  @MaxLength(20, { message: `Password Must Be Less Than 20 Characters` })
  @Matches(/((?=.*[a-z])(?=.*[A-Z]))/, {
    message: `Password Must Contain Upper Case Letter & Lower Case Letters`,
  })
  @Matches(/((?=.*[0-9]))/, {
    message: `Password Must Contain a number from 0-9`,
  })
  @Field(() => String, { description: 'User email', nullable: false })
  confirmPassword: string;
}
