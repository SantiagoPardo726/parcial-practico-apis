import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './city/city.module';
import { SupermarketModule } from './supermarket/supermarket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitySupermarketModule } from './city-supermarket/city-supermarket.module';

@Module({
  imports: [CityModule, SupermarketModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'supermarkets',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        dropSchema: true,
        synchronize: true,
        keepConnectionAlive: true
      }),
      CitySupermarketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
