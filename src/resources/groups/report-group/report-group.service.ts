import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DEFAULT_PAGINATION } from 'src/common/constants';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateReportGroupInput } from './dto/create-report-group.input';
import { FindManyReportGroupDto } from './dto/many-reportgroup-post.input';
import { UpdateReportGroupInput } from './dto/update-report-group.input';

@Injectable()
export class ReportGroupService {
  constructor(private readonly session: SessionService, private readonly prisma: PrismaService) {}

  create(createReportGroupInput: CreateReportGroupInput) {
try{
    const reporterProfileId=this.session.getUserProfileId();
    const report=this.prisma.reportGroup.create({
    data:{ 
      reporterProfileId,
    ...createReportGroupInput}
   })
  return report;}catch(error){
    throw new InternalServerErrorException(error);

  }
  }

  async myGroupReports(findManyReportGroupDto: FindManyReportGroupDto) {
    try {
      const { filter, pagination } = findManyReportGroupDto;
      const reporterProfileId = this.session.getUserProfileId();
      const where: Prisma.ReportGroupWhereInput = {
        reporterProfileId,
        deleted: false,
      };
      if (filter) {
        if (filter.resolved) {
          where.resolved = filter.resolved;
        }
        if (filter.nftTitle) {
          where.AND['nft'] = {
            title: {
              search: filter.nftTitle,
            },
          };
        }
        if (filter.reportType) {
          where.AND['reportType'] = {
            search: filter.reportType,
          };
        }
      }
      const data = await this.prisma.reportGroup.findMany({
        where,
        skip: (pagination?.page - 1) * pagination?.limit || DEFAULT_PAGINATION.PAGE,
        take: +pagination?.limit || DEFAULT_PAGINATION.PAGE_SIZE,
      });
      const count = await this.prisma.reportGroup.count({ where });
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













  findAll() {
    return `This action returns all reportGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reportGroup`;
  }

  update(id: number, updateReportGroupInput: UpdateReportGroupInput) {
    return `This action updates a #${id} reportGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportGroup`;
  }
}
