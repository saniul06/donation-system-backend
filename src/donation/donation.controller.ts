import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dtos/create-donation.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import {
  AllDonationDto,
  CreatedDonationDTO,
  DonationDto,
  MyDonationDto,
  UpdatedDonationDTO,
} from './dtos/donation.dto';
import { DonationFetchDto } from './dtos/donation-fetch.dto';
import { UpdateDonationDto } from './dtos/update-donation.dto';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { Public } from '../decorators/public.decorator';
import { MyDonationFetchDto } from './dtos/my-donation-fetch.dto';

@Controller('donation')
export class DonationController {
  private readonly logger = new Logger(DonationController.name);
  constructor(private donationService: DonationService) {}

  @Serialize(CreatedDonationDTO)
  @Public()
  @Post('/')
  async createDonation(@Body() body: CreateDonationDto) {
    try {
      this.logger.log('Donation create request');
      const createdDonation = await this.donationService.create(body);
      return {
        success: true,
        message: 'Donation created successfully',
        createdDonation,
      };
    } catch (err) {
      this.logger.error(
        `Donation create request failed with error ${err.stack}`,
      );
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AdminGuard)
  @Serialize(AllDonationDto)
  @Get('/')
  async getAllDonations(@Query() query: DonationFetchDto) {
    try {
      this.logger.log('Fetch all donation request');
      const donationList = await this.donationService.findAll(query);
      return { success: true, donationList };
    } catch (err) {
      this.logger.error(
        `Fetch all donation request failed with error ${err.stack}`,
      );
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Serialize(MyDonationDto)
  @Get('/me')
  async getMyDonations(
    @CurrentUser() currentUser: User,
    @Query() query: MyDonationFetchDto,
  ) {
    try {
      this.logger.log('Fetch all donation request');
      const myDonationList = await this.donationService.myDonations({
        userId: currentUser.id,
        ...query,
      });
      return { success: true, myDonationList };
    } catch (err) {
      this.logger.error(
        `Fetch all donation request failed with error ${err.stack}`,
      );
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Serialize(UpdatedDonationDTO)
  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDonationDto,
    @CurrentUser() currentUser: User,
  ) {
    try {
      this.logger.log('Donation update request');
      const updatedDonation = await this.donationService.update(
        id,
        body,
        currentUser?.id,
      );
      return {
        success: true,
        message: 'Donation updated successfully',
        updatedDonation,
      };
    } catch (err) {
      this.logger.error(
        `Donation update request failed with error ${err.stack}`,
      );
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteDonation(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    try {
      this.logger.log('Donation delete request');
      await this.donationService.delete(id, currentUser?.id);
      return { success: true, message: 'Donation deleted successfully' };
    } catch (err) {
      this.logger.error(
        `Donation delete request failed with error ${err.stack}`,
      );
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }
}
