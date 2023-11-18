import { Module } from '@nestjs/common';
import { SupermarketService } from './supermarket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketEntity } from './supermarket.entity';
import { SupermarketController } from './supermarket.controller';

@Module({
  providers: [SupermarketService],
  imports: [TypeOrmModule.forFeature([SupermarketEntity])],
  controllers: [SupermarketController],	
})
export class SupermarketModule {}
