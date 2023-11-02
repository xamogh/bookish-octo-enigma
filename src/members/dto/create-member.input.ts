import { InputType, Field } from '@nestjs/graphql';
import { GenderType, MembershipType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxDate,
  MaxLength,
  ValidateNested,
} from 'class-validator';

@InputType()
export class CreateMemberInput {
  @Field()
  @IsString()
  @MaxLength(64)
  firstName: string;

  @Field()
  @IsString()
  @MaxLength(64)
  lastName: string;

  @Field()
  @IsBoolean()
  isSanghaMember: boolean;

  @Field()
  @IsBoolean()
  active: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  middleName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phoneMobile?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phoneLand?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phoneOther?: string;

  @Field({ nullable: true })
  @IsOptional()
  centreId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(MembershipType)
  memberShip?: MembershipType;

  @Field({ nullable: true })
  @IsOptional()
  yearOfBirth?: number;

  @Field({ nullable: true })
  @IsEnum(GenderType)
  @IsOptional()
  gender?: GenderType;

  @Field({ nullable: true })
  @IsDate()
  @MaxDate(new Date())
  @IsOptional()
  sanghaJoinDate?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(128)
  refugeName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  viberNumber?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  @MaxLength(512)
  photo?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(3000)
  note?: string;

  @Field({ nullable: true })
  @IsOptional()
  currentAddress?: Address;

  @Field({ nullable: true })
  @IsOptional()
  permanentAddress?: Address;

  @Field({ nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  groups?: Array<Group>;
}

@InputType()
class Group {
  @Field({ nullable: false })
  id: number;
}

@InputType()
class Address {
  @Field({ nullable: true })
  @IsOptional()
  street: string;

  @Field({ nullable: true })
  @IsOptional()
  city: string;

  @Field({ nullable: true })
  @IsOptional()
  stateProvince: string;

  @Field({ nullable: false })
  country: string;
}
