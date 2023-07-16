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
import { DonationDto } from './dtos/donation.dto';
import { DonationFetchDto } from './dtos/donation-fetch.dto';
import { UpdateDonationDto } from './dtos/update-donation.dto';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../user/user.entity';

@Controller('donation')
export class DonationController {
  private readonly logger = new Logger(DonationController.name);
  constructor(private donationService: DonationService) {}

  @Post('/')
  async createDonation(@Body() body: CreateDonationDto) {
    try {
      this.logger.log('Donation create request');
      const d = await this.donationService.create(body);
      return { success: true, message: 'Donation created successfully', d };
    } catch (err) {
      this.logger.error(
        `Donation create request failed with error ${err.stack}`,
      );
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AdminGuard)
  @Serialize(DonationDto)
  @Get('/')
  async getAllDonations(@Query() query: DonationFetchDto) {
    try {
      this.logger.log('Fetch all donation request');
      const donationList = await this.donationService.findAll(query);
      return donationList;
    } catch (err) {
      this.logger.error(
        `Fetch all donation request failed with error ${err.stack}`,
      );
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Serialize(DonationDto)
  @Get('/me')
  async getMyDonations(@CurrentUser() currentUser: User) {
    try {
      this.logger.log('Fetch all donation request');
      const donationList = await this.donationService.myDonations(
        currentUser.id,
      );
      return donationList;
    } catch (err) {
      this.logger.error(
        `Fetch all donation request failed with error ${err.stack}`,
      );
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDonationDto,
  ) {
    try {
      this.logger.log('Donation update request');
      const updatedDonation = await this.donationService.update(id, body);
      return {
        success: true,
        message: 'Donation updated successfully',
        donation: updatedDonation,
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
  async deleteDonation(@Param('id', ParseIntPipe) id: number) {
    try {
      this.logger.log('Donation delete request');
      await this.donationService.delete(id);
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
