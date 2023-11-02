import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class ResetPasswordInitiateInput {
  @Field()
  @IsString()
  username: string;
}
