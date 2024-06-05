import { ObjectType, Field, Int, Directive, ID } from '@nestjs/graphql';
import { Paginated } from 'src/common/pagination/pagination.entity';
import { Profile } from 'src/resources/user/profile/entities/profile.entity';
import { Nft } from '../../entities/nft.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class ReportNft {
  @Field(() => ID, { description: 'follow ID', nullable: false })
  id: string;

  @Field(() => String, { description: 'profile ID', nullable: false })
  reporterProfileId: string;

  @Field(() => Profile, { description: 'profile', nullable: false })
  reporterProfile: Profile;

  @Field(() => String, { description: 'profile ID', nullable: false })
  nftId: string;

  @Field(() => Nft, { description: 'profile', nullable: false })
  nft: Nft;

  @Field(() => String, { description: 'description', nullable: true })
  description: string;

  @Field(() => String, { description: 'report type', nullable: false })
  reportType: string;

  @Field(() => Boolean, { description: 'resolved property', nullable: false })
  resolved: boolean;

  @Field(() => Date, { description: 'created date time', nullable: false })
  createdAt: Date;

  @Field(() => Date, { description: 'updated date time', nullable: false })
  updatedAt: Date | null;

  @Field(() => Boolean, { description: 'soft delete property', nullable: false })
  deleted: boolean;
}

@ObjectType()
export class PaginatedReportNft extends Paginated(ReportNft) {}
