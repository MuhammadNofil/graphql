import { CreateBlockProfileInput } from './create-block-profile.input';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UnBlockProfileInput extends CreateBlockProfileInput {}
