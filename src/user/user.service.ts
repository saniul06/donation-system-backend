import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { IFindUser } from '../types/user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(userData: Partial<User>) {
    const user = this.repo.create(userData);
    return await this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repo.find();
  }

  async findOneBy(query: IFindUser): Promise<User> {
    return await this.repo.findOneBy(query);
  }

  async remove(id: number) {
    await this.repo.delete(id);
  }
}
