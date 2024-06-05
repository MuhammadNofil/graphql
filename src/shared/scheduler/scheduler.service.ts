import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SuperRareGqlService } from '../super-rare-gql/super-rare-gql.service';
import { JsonHelperService } from '../json-helper/json-helper.service';
import { QueryHandlerService } from '../query-handler/query-handler.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulerService {
  private skip: number = 0;
  private first: number = 20;
  constructor(
    private readonly superRareGqlService: SuperRareGqlService,
    private readonly prisma: PrismaService,
    private readonly jsonHelperService: JsonHelperService,
    private readonly queryHandler: QueryHandlerService,
  ) { }

  logger = new Logger(SchedulerService.name);

  // @Cron(CronExpression.EVERY_5_MINUTES)
  async superRareCron() {
    try {
      console.log(this.first, this.skip);
      const data = await this.superRareGqlService.fetchArtWorks(this.skip, this.first);
      (this.first += 20), (this.skip += 20);
      await this.queryHandler.SuperRareGqlService(data);
    } catch (error) {
      console.log(error);
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async missingProfileCron() {
    try {
      const missingProfile = await this.prisma.user
        .findMany({
          where: {
            profile: null,
          },
        })
        .then((e) =>
          e.map((user) => {
            return { userId: user?.id };
          }),
        );
      this.logger.debug(`missing profiles user IDs: ${JSON.stringify(missingProfile)}`);
      const createdProfiles = await this.prisma.profile.createMany({
        data: missingProfile,
      });
      this.logger.debug(`profiles created for ${createdProfiles} numbers of accounts`);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async addSwipeCron() {
    this.logger.debug('swipe assignment cron running');
    try {
      const swipesAssignment = await this.prisma.profile.updateMany({
        where: {
          deleted: false,
          swipe: {
            lt: 100
          }
        },
        data: {
          swipe: 100
        }
      });
      this.logger.debug(`new swipes assigned to ${swipesAssignment.count} users`)
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
