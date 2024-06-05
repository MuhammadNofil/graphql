import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SignUp } from './entities/sign-up.entity';
import { UserSignUpInput } from './dto/user-signup.input';
import { SignIn } from './entities/sign-in.entity';
import { SignInDto } from './dto/user-signin.dto';
import { ForgetPasswordInput } from './dto/forget-password.input';
import { ForgetPasswordOtp } from './entities/forget-password-otp.entity';
import { ForgetPasswordVerifyOtp } from './entities/forget-password-verify-otp.entity';
import { VerifyOtpInput } from './dto/verify-otp.input';
import { ForgetResetPasswordInput } from './dto/forget-reset-password.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { ChangePasswordInput } from './dto/change-password.input';
import { MessageEntity } from 'src/common/message.entity';
import { EmailInputType } from 'src/common/email.input';
import { OtpEntity } from 'src/common/otp.entity';
import { ProfileService } from './profile/profile.service';
import { WalletService } from './wallet/wallet.service';
import { GoogleAccessTokenInput } from './dto/google-singup.input';
import { FacebookSigninDTO } from './dto/facebook-signup.input';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly walletService: WalletService,
  ) {}

  @Mutation(() => SignUp)
  signUp(@Args('userSignUpInput') userSignUpInput: UserSignUpInput) {
    return this.userService.userSignUp(userSignUpInput);
  }

  @Mutation(() => SignUp)
  googleSignup(@Args('googleAccessTokenInput') googleAccessTokenInput: GoogleAccessTokenInput) {
    return this.userService.googleSingup(googleAccessTokenInput);
  }

  @Mutation(() => SignUp)
  facebookLogin(@Args('facebookSigninDTO') facebookSigninDTO: FacebookSigninDTO) {
    return this.userService.facebookLogin(facebookSigninDTO);
  }

  @Query(() => SignIn)
  signIn(@Args('SignInDto') signInDto: SignInDto) {
    return this.userService.userSignIn(signInDto);
  }

  @Mutation(() => MessageEntity)
  forgetPassword(@Args('forgetPasswordInput') forgetPasswordInput: ForgetPasswordInput) {
    return this.userService.forgetPassword(forgetPasswordInput);
  }

  @Mutation(() => ForgetPasswordVerifyOtp)
  forgetPasswordVerifyOtp(@Args('verifyOtpForgetPasswordInput') verifyOtpForgetPasswordInput: VerifyOtpInput) {
    return this.userService.verifyForgetOtp(verifyOtpForgetPasswordInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SignIn)
  changeForgetPassword(@Args('verifyOtpForgetPasswordInput') forgetResetPasswordInput: ForgetResetPasswordInput) {
    return this.userService.changeForgetPassword(forgetResetPasswordInput);
  }

  @Mutation(() => OtpEntity)
  requestVerification(@Args('emailInputType') emailInputType: EmailInputType) {
    return this.userService.requestVerification(emailInputType);
  }

  @Mutation(() => MessageEntity)
  verifyAccount(@Args('verifyOtpInput') verifyOtpInput: VerifyOtpInput) {
    return this.userService.verifyAccount(verifyOtpInput);
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MessageEntity)
  changePassword(@Args('changePasswordInput') changePasswordInput: ChangePasswordInput) {
    return this.userService.changePassword(changePasswordInput);
  }

  @Query(() => [User], { name: 'user' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Query(() => Boolean)
  userNameAvailable(@Args('userName', { type: () => String }) userName: string) {
    return this.userService.userNameAvailable(userName);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }

  @ResolveField()
  async profile(@Parent() user: User) {
    const { id } = user;
    return this.profileService.findOne(id);
  }

  @ResolveField()
  async wallet(@Parent() user: User) {
    const { id } = user;
    return this.walletService.populateWallet(id);
  }

  @ResolveField()
  async notification(@Parent() user: User) {
    const { id } = user;
    return this.walletService.populateWallet(id);
  }
  @ResolveField()
  async notificationCreatedBy(@Parent() user: User) {
    const { id } = user;
    return this.walletService.populateWallet(id);
  }
}
