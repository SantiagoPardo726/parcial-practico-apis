import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CitySupermarketService } from './city-supermarket.service';
import { plainToInstance } from 'class-transformer';
import { CityDto } from 'src/city/city.dto';
import { SupermarketDto } from 'src/supermarket/supermarket.dto';
import { SupermarketEntity } from 'src/supermarket/supermarket.entity';
@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CitySupermarketController {
  constructor(
    private readonly citySupermarketsService: CitySupermarketService,
  ) {}
  @Post(':cityId/supermarkets/:supermarketId')
  async addSupermarketCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketsService.addSupermarketCity(
        cityId,
        supermarketId,
    );
  }
  @Get(':cityId/supermarkets/:supermarketId')
  async findSupermarketByCityIdsupermarketId(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketsService.findSupermarketByCityIdsupermarketId(
      cityId,
      supermarketId,
    );
  }
  @Get(':cityId/supermarkets')
  async findSupermarketsByCityId(@Param('cityId') cityId: string) {
    return await this.citySupermarketsService.findSupermarketsByCityId(
      cityId,
    );
  }
  @Put(':cityId/supermarkets')
  async associateSupermarketsCity(
    @Body() supermarketDto: SupermarketDto[],
    @Param('cityId') cityId: string,
  ) {
    const supermarkets = plainToInstance(SupermarketEntity, supermarketDto);
    return await this.citySupermarketsService.associateSupermarketsCity(
      cityId,
      supermarkets,
    );
  }
  @Delete(':cityId/supermarkets/:supermarketId')
  @HttpCode(204)
  async deleteSupermarketCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketsService.deleteSupermarketCity(
      cityId,
      supermarketId,
    );
  }
}
