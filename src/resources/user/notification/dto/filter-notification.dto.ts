import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class FilterNotificationDto {
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { description: 'title of the nft', nullable: true })
  isRead: boolean;
}
