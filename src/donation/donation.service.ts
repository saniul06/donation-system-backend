import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { LessThan, MoreThan, Repository, SelectQueryBuilder } from 'typeorm';
import { IDonationOpts, IFindDonation } from '../types/donation.types';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { UserRole } from '../types/user.types';
import * as moment from 'moment';

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

  async donationSummary(query: IFindDonation) {
    const { category } = query;
    const today = moment().startOf('day');
    const todayQueryBuilder = this.repo.createQueryBuilder('donation');
    todayQueryBuilder.select('SUM(donation.amount)', 'totalAmount');
    todayQueryBuilder.where('donation.createdAt > :afterDate', {
      afterDate: today,
    });
    if (category) {
      todayQueryBuilder.andWhere('donation.category = :category', { category });
    }
    const todayAmount = await todayQueryBuilder.getRawOne();

    const currentWeek = moment().startOf('day');
    const weeklyQueryBuilder = this.repo.createQueryBuilder('donation');
    weeklyQueryBuilder.select('SUM(donation.amount)', 'totalAmount');
    weeklyQueryBuilder.where('donation.createdAt > :afterDate', {
      afterDate: currentWeek,
    });
    if (category) {
      weeklyQueryBuilder.andWhere('donation.category = :category', {
        category,
      });
    }
    const weeklyAmount = await weeklyQueryBuilder.getRawOne();

    const currentMonth = moment().startOf('day');
    const monthlyQueryBuilder = this.repo.createQueryBuilder('donation');
    monthlyQueryBuilder.select('SUM(donation.amount)', 'totalAmount');
    monthlyQueryBuilder.where('donation.createdAt > :afterDate', {
      afterDate: currentMonth,
    });
    if (category) {
      monthlyQueryBuilder.andWhere('donation.category = :category', {
        category,
      });
    }
    const monthlyAmount = await monthlyQueryBuilder.getRawOne();

    const currentYear = moment().startOf('day');
    const yearlyQueryBuilder = this.repo.createQueryBuilder('donation');
    yearlyQueryBuilder.select('SUM(donation.amount)', 'totalAmount');
    yearlyQueryBuilder.where('donation.createdAt > :afterDate', {
      afterDate: currentYear,
    });
    if (category) {
      yearlyQueryBuilder.andWhere('donation.category = :category', {
        category,
      });
    }
    const yearlyAmount = await yearlyQueryBuilder.getRawOne();

    const totalQueryBuilder = this.repo.createQueryBuilder('donation');
    totalQueryBuilder.select('SUM(donation.amount)', 'totalAmount');
    if (category) {
      totalQueryBuilder.where('donation.category = :category', {
        category,
      });
    }
    const totalAmount = await totalQueryBuilder.getRawOne();
    return {
      todayAmount: parseFloat(todayAmount.totalAmount) || 0,
      weeklyAmount: parseFloat(weeklyAmount.totalAmount) || 0,
      monthlyAmount: parseFloat(monthlyAmount.totalAmount) || 0,
      yearlyAmount: parseFloat(yearlyAmount.totalAmount) || 0,
      totalAmount: parseFloat(totalAmount.totalAmount) || 0,
    };
  }
}
