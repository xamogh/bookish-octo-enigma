import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class ResponseStatus {
  @Field()
  status: number;
  constructor(status: number) {
    this.status = status;
  }
}
