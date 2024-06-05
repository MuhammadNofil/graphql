import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SessionService } from 'src/shared/session/session.service';
import { CreateFeedbackInput } from './dto/create-feedback.input';
import { UpdateFeedbackInput } from './dto/update-feedback.input';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService, private readonly session: SessionService) {}
  async create(createFeedbackInput: CreateFeedbackInput) {
    try {
      const profileId = this.session.getUserProfileId();
      const feedback = await this.prisma.feedBack.create({
        data: {
          profileId,
          ...createFeedbackInput,
        },
      });
      return feedback;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // findAll() {
  //   return `This action returns all feedback`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} feedback`;
  // }

  // update(id: number, updateFeedbackInput: UpdateFeedbackInput) {
  //   return `This action updates a #${id} feedback`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} feedback`;
  // }
}
