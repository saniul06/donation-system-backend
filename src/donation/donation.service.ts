import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { IDonationOpts, IFindDonation } from '../types/donation.types';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { UserRole } from '../types/user.types';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private repo: Repository<Donation>,
    private userService: UserService,
  ) {}

  async create(donationData: IDonationOpts): Promise<Donation> {
    const { userId, ...rest } = donationData;
    let user: User;
    const donationObj: Partial<Donation> = { ...rest };
    if (userId) {
      user = await this.userService.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('User not found');
      donationObj.user = user;
    }
    const donation = this.repo.create(donationObj);
    return await this.repo.save(donation);
  }

  async findAll(query: IFindDonation): Promise<Donation[]> {
    const limit = 10;
    const { lastId, userId, ...rest } = query;
    const queryObj: any = {
      where: { ...rest },
      relations: { user: true },
      take: limit,
      order: {
        id: 'DESC',
      },
    };

    if (lastId) queryObj.where = { ...queryObj.where, id: LessThan(lastId) };
    if (userId) {
      const user = await this.userService.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('User not found');
      delete user.createdAt;
      delete user.updatedAt;
      queryObj.where = { ...queryObj.where, user };
    }
    return await this.repo.find({ ...queryObj });
  }

  async myDonations(query: IFindDonation): Promise<Donation[]> {
    const limit = 10;
    const { lastId, userId, ...rest } = query;
    const user = await this.userService.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    const queryObj: any = {
      where: { ...rest },
      relations: { user: true },
      take: limit,
      order: {
        id: 'DESC',
      },
    };
    if (lastId) queryObj.where = { ...queryObj.where, id: LessThan(lastId) };
    delete user.createdAt;
    delete user.updatedAt;
    queryObj.where = { ...queryObj.where, user };
    return await this.repo.find({ ...queryObj });
  }

  async update(
    id: number,
    updateOpts: Partial<Donation>,
    userId: number,
  ): Promise<Donation> {
    await this.adminCheck(userId);
    let donation = await this.repo.findOneBy({ id });
    if (!donation) throw new NotFoundException('Donation not found');
    donation = { ...donation, ...updateOpts };
    return await this.repo.save(donation);
  }

  async delete(id: number, userId: number) {
    await this.adminCheck(userId);
    return await this.repo.softRemove({ id });
  }

  async adminCheck(userId: number) {
    const user = await this.userService.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== UserRole.ADMIN) throw new UnauthorizedException();
  }
}
