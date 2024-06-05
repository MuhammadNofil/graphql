import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ResolveField } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { TranscribeService } from 'aws-sdk';
import { DEFAULT_PAGINATION } from 'src/common/constants';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateReportNftInput } from './dto/create-report-nft.input';
import { FindManyReportNftDto } from './dto/find-many-rate-nfts.dto';
import { UpdateReportNftInput } from './dto/update-report-nft.input';

@Injectable()
export class ReportNftService {
  constructor(private readonly prisma: PrismaService, private readonly session: SessionService) {}

  logger = new Logger(ReportNftService.name);

  async create(createReportNftInput: CreateReportNftInput) {
    try {
      const { description, nftId, reportType } = createReportNftInput;
      const reporterProfileId = this.session.getUserProfileId();
      const check = await this.prisma.reportNft.findFirst({
        where: {
          nftId,
          reporterProfileId,
          deleted: false,
          resolved: false,
        },
        select: {
          id: true,
        },
      });
      if (check) {
        throw new BadRequestException(`You have already reported this NFT and it is in review`);
      }
      const report = await this.prisma.reportNft.create({
        data: {
          nftId: nftId,
          description,
          reporterProfileId,
          reportType,
        },
      });
      return report;
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async myNftReports(findManyReportNftDto: FindManyReportNftDto) {
    try {
      const { filter, pagination } = findManyReportNftDto;
      console.log(filter,pagination);
      const reporterProfileId = this.session.getUserProfileId();
      const reportNftWhereArgs: Prisma.ReportNftFindManyArgs = {
        where:{
        reporterProfileId,
        deleted: false,
      },
      skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      };
      if (filter) {
        if (filter.resolved) {
          reportNftWhereArgs.where.resolved = filter.resolved;
        }
        if (filter.nftTitle) {
          reportNftWhereArgs.where.nft={
            title:filter.nftTitle,
          }
        }
        if (filter.reportType) {
          reportNftWhereArgs.where.reportType=filter.reportType
        }
      }
      const data = await this.prisma.reportNft.findMany(reportNftWhereArgs);
      const count = await this.prisma.reportNft.count({ where:reportNftWhereArgs.where });
      return {
        data,
        metadata: {
          page: +pagination?.page || DEFAULT_PAGINATION.PAGE + 1,
          limit: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
          total: {
            pages: Math.ceil(count / (+pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE)),
            records: count,
          },
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

async populateNft(id:string){
  try{
 const nft=await this.prisma.nft.findFirst({
  where:{
    id,
    deleted:false,
  }
 })
 return nft;
  }catch(error){

  }
}


async populateProfile(reporterProfileId: string) {
  try {
    const profile = await this.prisma.profile.findFirst({
      where: {
        deleted: false,
        id: reporterProfileId,
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
    return `This action returns a #${id} reportNft`;
  }

  update(id: number, updateReportNftInput: UpdateReportNftInput) {
    return `This action updates a #${id} reportNft`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportNft`;
  }
}
