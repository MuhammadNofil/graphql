import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { EmailInputType } from 'src/common/email.input';
import { MessageEntity } from 'src/common/message.entity';
import { OtpEntity } from 'src/common/otp.entity';
import { Crypt } from 'src/config/crypt';
import { OtpService } from 'src/shared/otp/otp.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { CreateUserInput } from './dto/create-user.input';
import { ForgetPasswordInput } from './dto/forget-password.input';
import { ForgetResetPasswordInput } from './dto/forget-reset-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SignInDto } from './dto/user-signin.dto';
import { UserSignUpInput } from './dto/user-signup.input';
import { VerifyOtpInput } from './dto/verify-otp.input';
import { ForgetPasswordOtp } from './entities/forget-password-otp.entity';
import { ForgetPasswordVerifyOtp } from './entities/forget-password-verify-otp.entity';
import { Role } from './entities/role.entity';
import { SignIn } from './entities/sign-in.entity';
import { SignUp } from './entities/sign-up.entity';
import { ProfileService } from './profile/profile.service';
import { Auth, google, oauth2_v2 } from 'googleapis';
import { GoogleAccessTokenInput } from './dto/google-singup.input';
import { GaxiosResponse } from 'gaxios';
import { HelpersService } from 'src/shared/helpers/helpers.service';
import { SocialSignUpUserDto } from './dto/social-signup.dto';
import { FacebookSigninDTO } from './dto/facebook-signup.input';
import { HttpClientService } from 'src/shared/http-client/http-client.service';
import { EmailService } from 'src/shared/email/email.service';
import { JsonHelperService } from 'src/shared/json-helper/json-helper.service';
import { CompressionHelperService } from 'src/shared/compression-helper/compression-helper.service';
import { FileService } from 'src/shared/file/file.service';
import { SuperRareGqlService } from 'src/shared/super-rare-gql/super-rare-gql.service';
import { ERC_721_GqlService } from 'src/shared/ERC-721-gql/ERC-721-gql-service';
import { FoundationGqlService } from 'src/shared/foundation-gql/foundation-gql.service';
import { OPENSEA_v1GqlService } from 'src/shared/open-sea -v1-gql/open-sea-gql.service';
import { OPENSEA_v2GqlService } from 'src/shared/open-sea-v2-gql/open-sea-v2.service';

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
@Injectable()
export class UserService {
  constructor(
    private readonly session: SessionService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly otpSerivce: OtpService,
    private readonly profileService: ProfileService,
    private readonly helper: HelpersService,
    private readonly httpClient: HttpClientService,
    private readonly email: EmailService,
    private readonly oauthClient: Auth.OAuth2Client = new google.auth.OAuth2(clientId, clientSecret),
    private readonly jsonHelper: JsonHelperService,
    private readonly compressionHelper: CompressionHelperService,
    private readonly fileService: FileService,
    private readonly superRareGql: SuperRareGqlService, // private readonly eRC_721Gql:       ERC_721_GqlService, // private readonly foundationGql: FoundationGqlService, // private readonly openSea_v1Gql: OPENSEA_v1GqlService, // private readonly openSea_v2Gql:OPENSEA_v2GqlService
  ) {}

  logger = new Logger(UserService.name);

  async userSignUp(userSignUpInput: UserSignUpInput): Promise<SignUp> {
    try {
      const { email, password, confirmPassword, userName, signature } = userSignUpInput;
      if (password !== confirmPassword) {
        throw new BadRequestException('Password mismatch');
      }
      const role: Partial<Role> = await this.prisma.role.findUnique({
        where: {
          title: 'user',
        },
        select: {
          id: true,
        },
      });
      if (!role) {
        throw new NotFoundException('Please create role first');
      }
      const user = await this.prisma.user.create({
        data: {
          email,
          password: await Crypt.hashString(password),
          userName,
          roleId: role.id,
        },
        include: {
          role: true,
        },
      });
      const profileId = await this.profileService.bootstrap(user.id);
      //TODO: return profile along
      const otp: string = this.otpSerivce.generateTotpToken();
      await this.email.sendVerificationEmail({ otp, receiver: email });
      delete user.password;
      const token = this.jwt.sign({
        email: user.email,
        id: user.id,
        role: user.role.title,
      });
      if (signature) {
        await this.validateMember(signature, profileId);
      }
      return {
        user,
        token,
      };
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002' && error?.meta?.target[0] === 'email') {
        error = `User with email: ${userSignUpInput.email} already exist`;
      } else if (error.code === 'P2002' && error?.meta?.target[0] === 'userName') {
        error = `User with user name: ${userSignUpInput.userName} already exist`;
      }
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async validateMember(signature: string, profileId: string) {
    const decode: string = Buffer.from(signature, 'base64').toString('ascii');
    console.log(decode);
    const existUser = await this.prisma.groupMember.findFirst({
      where: {
        group: {
          id: decode,
        },
        profileId,
      },
    });
    if (existUser) {
      console.log('user already exists');
      return;
    }
    const groupMember = await this.prisma.groupMember.create({
      data: {
        groupId: decode,
        profileId,
        role: 'member',
      },
    });
  }

  async userSignIn(signInDto: SignInDto): Promise<SignIn> {
    try {
      //TODO: let the below code stay here for some time testing a few things for external NFTs
      // await this.superRareGql.fetchArtWorks();
      // await this.eRC_721Gql.fetchArtWorks();
      // await this.foundationGql.fetchArtWorks();
      // await this.openSea_v1Gql.fetchArtWorks();
      // await this.openSea_v2Gql.fetchArtWorks();
      // const data = await this.jsonHelper.readFile(
      //   'https://ipfs.pixura.io/ipfs/QmaSn5N6uc9726PKbUbvAfDcg5ibpuqJ8QrMjtBzKaC1Vs/metadata.json',
      // );
      // const compression = await this.compressionHelper.compressImage(
      //   'https://ipfs.pixura.io/ipfs/Qmdt566Ucaj5hrVMHY1BXsWsyRTf9j1tmKJ3bRgHuaZKY8/Turbo_2022.JPG',
      //   50,
      // );
      // const file = await this.fileService.uploadBufferFile(compression, 'nft-test/', 'nft-tests', data.media.mimeType);
      const user = await this.prisma.user.findUnique({
        where: { email: signInDto?.email },
        include: {
          role: true,
        },
      });
      if (!user) throw new UnauthorizedException(`User doesn't exist`);

      if (!(await Crypt.compare(signInDto.password, user.password))) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      //add check for verification status left
      const token = this.jwt.sign({
        email: user.email,
        id: user.id,
        role: user.role.title,
      });
      delete user.password;
      const profile = await this.prisma.user.findFirst({
        where: {
          email: signInDto.email,
        },
        select: {
          profile: true,
        },
      });

      if (signInDto.signature) {
        await this.validateMember(signInDto.signature, profile.profile.id);
      }
      return { user, token };

      // return { user: omit(user, 'password'), accessToken };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async forgetPassword(forgetPasswordInput: ForgetPasswordInput): Promise<MessageEntity> {
    try {
      const { email } = forgetPasswordInput;
      const check = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!check) {
        throw new NotFoundException(`User doesn't exist`);
      }
      if (check.deleted) {
        throw new NotFoundException('User deleted');
      }
      const otp = await this.otpSerivce.generateTotpToken();
      //TODO: emit an email to user
      const mailSent = await this.email.sendForgetPasswordEmail({ otp, receiver: check?.email });
      return { message: 'reset password code sent on your email' };
    } catch (error) {
      console.log(error);
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async verifyForgetOtp(verifyOtpForgetPasswordInput: VerifyOtpInput): Promise<ForgetPasswordVerifyOtp> {
    try {
      const { email, otp } = verifyOtpForgetPasswordInput;
      const check = await this.prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          role: true,
        },
      });
      if (!check) {
        throw new NotFoundException('User not found');
      }
      if (check.deleted) {
        throw new NotFoundException('User deleted');
      }
      const otpCheck = this.otpSerivce.verifyTotpToken(otp);
      if (!otpCheck) {
        throw new BadRequestException('Invalid OTP');
      }
      const token = this.jwt.sign({
        email: check.email,
        id: check.id,
        role: check.role.title,
        tokenType: 'FORGET_PASSWORD',
      });
      return { token };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async changeForgetPassword(forgetResetPasswordInput: ForgetResetPasswordInput): Promise<SignIn> {
    try {
      const { password, confirmPassword } = forgetResetPasswordInput;
      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords mismatch');
      }
      const userId = await this.session.getUserId();
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: await Crypt.hashString(forgetResetPasswordInput.password),
        },
        include: {
          role: true,
        },
      });
      const token = this.jwt.sign({
        email: user.email,
        id: user.id,
        role: user.role.title,
      });
      delete userId.password;
      return { user, token };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async changePassword(changePasswordInput: ChangePasswordInput): Promise<MessageEntity> {
    try {
      const { oldPassword, newPassword } = changePasswordInput;
      const userId = this.session.getUserId();
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!(await Crypt.compare(oldPassword, user.password))) {
        throw new UnauthorizedException('Wrong old password');
      }
      if (oldPassword === newPassword) {
        throw new BadRequestException('Old password cannot be the same as new password');
      }
      const update = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: await Crypt.hashString(newPassword),
        },
        select: {
          id: true,
        },
      });
      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async verifyAccount(verifyOtpInput: VerifyOtpInput): Promise<MessageEntity> {
    try {
      const { email, otp } = verifyOtpInput;
      const user: Partial<User> = await this.prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          deleted: true,
          isVerified: true,
        },
      });
      if (!user || user?.deleted) {
        throw new NotFoundException('User not found');
      }
      if (user?.isVerified === true) {
        throw new BadRequestException('User is already verified');
      }
      const check: boolean = this.otpSerivce.verifyTotpToken(otp);
      if (!check) {
        throw new BadRequestException('Invalid OTP');
      }
      const update: Partial<User> = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
        },
        select: {
          email: true,
          userName: true,
        },
      });
      const message = `${update.userName} associated with email: ${update.email} verified successfully!`;
      return { message };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async requestVerification(emailInputType: EmailInputType): Promise<OtpEntity> {
    try {
      const { email } = emailInputType;
      const user: Partial<User> = await this.prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          deleted: true,
          isVerified: true,
        },
      });
      if (!user || user?.deleted) {
        throw new NotFoundException('User not found');
      }
      if (user.isVerified === true) {
        throw new BadRequestException('User is already verified');
      }
      const otp: string = this.otpSerivce.generateTotpToken();
      await this.email.sendVerificationEmail({ otp, receiver: email });
      return { otp };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async facebookLogin(facebookSigninDTO: FacebookSigninDTO): Promise<any> {
    try {
      const data = await this.httpClient.facebookGetUser(facebookSigninDTO);
      console.log('🚀 ~ file: user.service.ts:336 ~ UserService ~ facebookLogin ~ data', data);
      const email = await this.findUserByEmail(data?.email);
      if (email) {
        return this.singInByEmail(email);
      }
      const signupObj: SocialSignUpUserDto = {
        userName: data.name + this.helper.randomNumbers(),
        email: data.email,
        password: await this.helper.generatePassword(),
      };
      return await this.SocialSignup(signupObj);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async googleSingup(googleAccessTokenDto: GoogleAccessTokenInput): Promise<any> {
    try {
      const tokenInfo: Auth.TokenInfo = await this.oauthClient.getTokenInfo(googleAccessTokenDto.accessToken);
      const email = await this.findUserByEmail(tokenInfo.email);
      if (email) {
        return this.singInByEmail(email);
      }
      return this.getGoogleUserInfo(googleAccessTokenDto.accessToken);
    } catch (error) {
      console.log(error);
    }
  }

  async findUserByEmail(email: string): Promise<User['email']> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          email: true,
          deleted: true,
        },
      });
      if (user?.deleted) {
        throw new BadRequestException(`You deleted your account please contact support`);
      }
      return user?.email;
    } catch (error) {
      console.log(error);
    }
  }

  async singInByEmail(email: string): Promise<SignUp> {
    try {
      email = email.toLocaleLowerCase();
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          role: true,
        },
      });
      if (user?.deleted) {
        throw new BadRequestException(`You deleted your account please contact support`);
      }
      if (user) {
        const token = this.jwt.sign({
          email: user.email,
          id: user.id,
          role: user.role.title,
        });
        if (!user.isVerified) {
          const verifyEmail = await this.prisma.user.update({
            where: {
              id: user?.id,
            },
            data: {
              isVerified: true,
            },
          });
        }
        delete user.password;
        return { user, token };
      }
      throw new UnauthorizedException('Invalid Credentials');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getGoogleUserInfo(accessToken: string): Promise<any> {
    try {
      const userInfoClient = google.oauth2('v2').userinfo;
      this.oauthClient.setCredentials({
        access_token: accessToken,
      });
      const userInfoResponse: GaxiosResponse<oauth2_v2.Schema$Userinfo> = await userInfoClient.get({
        auth: this.oauthClient,
      });
      const signupObj: SocialSignUpUserDto = {
        userName: `${userInfoResponse.data.given_name}_${userInfoResponse.data.family_name}`.split(' ').join(''),
        email: userInfoResponse.data.email,
        password: await this.helper.generatePassword(),
      };
      //TODO: send an email for password
      return await this.SocialSignup(signupObj);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async SocialSignup(socialSignUpUserDto: SocialSignUpUserDto): Promise<SignUp> {
    console.log(
      '🚀 ~ file: user.service.ts:446 ~ UserService ~ SocialSignup ~ socialSignUpUserDto',
      socialSignUpUserDto,
    );
    try {
      const usercheck = await this.prisma.user.findUnique({
        where: {
          email: socialSignUpUserDto.email,
        },
      });
      if (usercheck) {
        throw new BadRequestException(`User doesn't exist`);
      }
      const role = await this.prisma.role.findUnique({
        where: {
          title: 'user',
        },
      });
      if (!role) {
        throw new BadRequestException(`Role does not exist`);
      }
      socialSignUpUserDto.password = await Crypt.hashString(socialSignUpUserDto.password);
      // const user = await this.prisma.user.create({
      //   data: {
      //     email: socialSignUpUserDto.email,
      //     userName: socialSignUpUserDto.userName,
      //     password: socialSignUpUserDto.password,
      //     isVerified: true,
      //     roleId: role?.id,
      //   },
      //   include: {
      //     role: true,
      //   },
      // });
      return await this.userSignUp({
        email: socialSignUpUserDto.email,
        userName: socialSignUpUserDto.userName + this.helper.randomNumbers(),
        password: socialSignUpUserDto.password,
        confirmPassword: socialSignUpUserDto.password,
      });
      // const token = this.jwt.sign({
      //   email: user.email,
      //   id: user.id,
      //   role: user.role.title,
      // });
      // delete user.password;
      // //TODO: send an email to user about the new password that he can change or use
      // return {
      //   user,
      //   token,
      // };
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002' && error?.meta?.target[0] === 'email') {
        throw new BadRequestException(`User with email: ${socialSignUpUserDto.email} already exist`);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async userNameAvailable(userName: string): Promise<boolean> {
    try {
      const check = await this.prisma.user.findUnique({
        where: {
          userName,
        },
      });
      return !check;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async populateNotification(id: string) {
    try {
      const notification = await this.prisma.notification.findMany({
        where: {
          userId: id,
          deleted: false,
        },
      });
      return notification;
    } catch (error) {}
  }

  async populateNotificationCreatedBy(id: string) {
    try {
      const notificationCreator = await this.prisma.notification.findMany({
        where: {
          userId: id,
          deleted: false,
        },
      });
      return notificationCreator;
    } catch (error) {}
  }

  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
