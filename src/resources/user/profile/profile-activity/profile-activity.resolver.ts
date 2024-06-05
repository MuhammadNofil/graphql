import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProfileActivityService } from './profile-activity.service';
import { ProfileActivity } from './entities/profile-activity.entity';
import { CreateProfileActivityInput } from './dto/create-profile-activity.input';
import { UpdateProfileActivityInput } from './dto/update-profile-activity.input';
import { PaginationDto } from 'src/common/pagination.dto';
import { GqlAuthGuard } from 'src/shared/guards/gql-authguard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => ProfileActivity)
export class ProfileActivityResolver {
  constructor(private readonly profileActivityService: ProfileActivityService) {}

  // @Mutation(() => ProfileActivity)
  // createProfileActivity(@Args('createProfileActivityInput') createProfileActivityInput: CreateProfileActivityInput) {
  //   return this.profileActivityService.create(createProfileActivityInput);
  // }

  @UseGuards(GqlAuthGuard)
  @Query(() => ProfileActivity)
  findAllActivities(@Args('paginationDto') paginationDto: PaginationDto) {
    return this.profileActivityService.findAll(paginationDto);
  }

  // @Query(() => ProfileActivity, { name: 'profileActivity' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.profileActivityService.findOne(id);
  // }

  // @Mutation(() => ProfileActivity)
  // updateProfileActivity(@Args('updateProfileActivityInput') updateProfileActivityInput: UpdateProfileActivityInput) {
  //   return this.profileActivityService.update(updateProfileActivityInput.id, updateProfileActivityInput);
  // }

  // @Mutation(() => ProfileActivity)
  // removeProfileActivity(@Args('id', { type: () => Int }) id: number) {
  //   return this.profileActivityService.remove(id);
  // }
}
