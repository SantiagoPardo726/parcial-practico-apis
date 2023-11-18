import { TypeOrmModule } from "@nestjs/typeorm";
import { CityEntity } from "../../city/city.entity";
import { SupermarketEntity } from "../../supermarket/supermarket.entity";

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        synchronize: true,
        entities: [
            CityEntity,
            SupermarketEntity
        ],
        keepConnectionAlive: true,
    }),
    TypeOrmModule.forFeature([
        SupermarketEntity,CityEntity
    ]),
];