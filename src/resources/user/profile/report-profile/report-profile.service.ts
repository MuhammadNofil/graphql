import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateReportProfileInput } from './dto/create-report-profile.input';
import { UpdateReportProfileInput } from './dto/update-report-profile.input';

@Injectable()
export class ReportProfileService {
  constructor(private readonly session: SessionService, private readonly prisma: PrismaService) {}

  async create(createReportProfileInput: CreateReportProfileInput) {
    try {
      const profileId = this.session.getUserProfileId();
      const { description, reportType, reportedProfileId } = createReportProfileInput;
      const report = await this.prisma.reportProfile.create({
        data: {
          profileId,
          reportedProfileId,
          reportType,
          description,
        },
      });
      return report;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  //TODO: add filter and pagination
  async findAll() {
    try {
      const reports = await this.prisma.reportProfile.findMany({
        where: {
          deleted: false,
        },
      });
      return reports;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async populateProfile(profileId: string) {
    try {
      const profile = await this.prisma.profile.findFirst({
        where: {
          deleted: false,
          id: profileId,
        },
      });
      if (!profile) {
        throw new BadRequestException('Profile not found');
      }
      return profile;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} reportProfile`;
  }

  update(id: number, updateReportProfileInput: UpdateReportProfileInput) {
    return `This action updates a #${id} reportProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportProfile`;
  }
}
