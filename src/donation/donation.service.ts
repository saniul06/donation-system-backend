import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { MoreThan, Repository } from 'typeorm';
import { IDonationOpts, IFindDonation } from '../types/donation.types';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

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
    };
    if (lastId) queryObj.where = { ...queryObj.where, id: MoreThan(lastId) };
    if (userId) {
      const user = await this.userService.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('User not found');
      queryObj.where = { ...queryObj.where, user };
    }
    return await this.repo.find({ ...queryObj });
  }

  async myDonations(userId: number): Promise<Donation[]> {
    const user = await this.userService.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    return await this.repo.find({ where: { user } });
  }

  async update(id: number, updateOpts: Partial<Donation>): Promise<Donation> {
    let donation = await this.repo.findOneBy({ id });
    if (!donation) throw new NotFoundException('Donation not found');
    donation = { ...donation, ...updateOpts };
    return await this.repo.save(donation);
  }

  async delete(id: number) {
    return await this.repo.softRemove({ id });
  }
}
