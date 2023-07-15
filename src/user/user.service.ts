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

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async find(query: IFindUser): Promise<User[]> {
    return this.repo.find({ where: query });
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  create(userData: Partial<User>) {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }
}
