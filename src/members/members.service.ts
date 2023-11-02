import { Injectable } from '@nestjs/common';
import { CreateMemberInput } from './dto/create-member.input';
import { UpdateMemberInput } from './dto/update-member.input';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMemberInput: CreateMemberInput) {
    const {
      firstName,
      lastName,
      active,
      isSanghaMember,
      email,
      middleName,
      title,
      phoneMobile,
      phoneLand,
      phoneOther,
      centreId,
      memberShip,
      yearOfBirth,
      gender,
      sanghaJoinDate,
      refugeName,
      viberNumber,
      photo,
      note,
      currentAddress,
      permanentAddress,
      groups,
    } = createMemberInput;
    return this.prisma.member.create({
      data: {
        firstName,
        lastName,
        active,
        isSanghaMember,
        email,
        middleName,
        title,
        phoneMobile,
        phoneLand,
        phoneOther,
        memberShip,
        yearOfBirth,
        gender,
        sanghaJoinDate,
        refugeName,
        viberNumber,
        photo,
        note,
        currentAddress: {
          create: currentAddress,
        },
        permanentAddress: {
          create: permanentAddress,
        },
        groups: {
          connect: groups,
        },
        centre: {
          connect: { id: centreId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.member.findMany({
      where: {
        isDeleted: false,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.member.findFirstOrThrow({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  update(id: number, updateMemberInput: UpdateMemberInput) {
    return this.prisma.member.findFirstOrThrow({
      where: {
          id
      }
    })
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
