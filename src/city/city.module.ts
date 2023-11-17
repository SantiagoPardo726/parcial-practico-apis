import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './city.entity';

@Module({
  providers: [CityService],
  imports: [TypeOrmModule.forFeature([CityEntity])],
})
export class CityModule {}
