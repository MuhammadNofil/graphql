import { CreateFollowInput } from './create-follow.input';
import { InputType, Field, Int, PartialType, PickType } from '@nestjs/graphql';

@InputType()
export class UpdateFollowInput extends CreateFollowInput {}
