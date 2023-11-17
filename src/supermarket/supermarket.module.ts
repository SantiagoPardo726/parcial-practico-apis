import { Module } from '@nestjs/common';
import { SupermarketService } from './supermarket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketEntity } from './supermarket.entity';

@Module({
  providers: [SupermarketService],
  imports: [TypeOrmModule.forFeature([SupermarketEntity])],	
})
export class SupermarketModule {}
